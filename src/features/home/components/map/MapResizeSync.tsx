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
      // View Transitions may reparent this node before Leaflet's map.remove().
      // Detach with Element.remove() so parent.removeChild does not throw
      // (X-back / soft-nav). Same cleanup MapSafeTeardown used to own alone.
      try {
        container.remove();
      } catch {
        /* already detached */
      }
    };
  }, [map]);

  return null;
}
