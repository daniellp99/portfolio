"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, useMap } from "react-leaflet";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/site/constants";

/** Keep Leaflet’s view box in sync with the card size; safe VT teardown. */
function MapResizeSync() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let frame = 0;

    function syncView() {
      map.invalidateSize();
      map.panTo(DEFAULT_CENTER, { animate: false });
    }

    function scheduleSync() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncView);
    }

    const observer = new ResizeObserver(scheduleSync);
    observer.observe(container);
    scheduleSync();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      try {
        container.remove();
      } catch {
        /* already detached */
      }
    };
  }, [map]);

  return null;
}

export default function MapRoot({ children }: { children: React.ReactNode }) {
  return (
    <MapContainer
      attributionControl={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
      zoomAnimation={false}
      minZoom={1}
      zoomSnap={0.01}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      maxZoom={16}
      className="isolate grid size-full [grid-template-areas:'map']"
    >
      <MapResizeSync />
      {children}
    </MapContainer>
  );
}
