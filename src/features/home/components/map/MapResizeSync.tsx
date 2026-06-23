"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

import { DEFAULT_CENTER } from "@/lib/site/constants";

export default function MapResizeSync() {
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
    };
  }, [map]);

  return null;
}
