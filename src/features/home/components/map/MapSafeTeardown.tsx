"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * View Transitions may reparent the Leaflet root while React unmounts the map
 * island (home → project, or the reverse soft-nav). Leaflet then throws
 * `NotFoundError` on `parent.removeChild(container)`. Detach with
 * `Element.remove()` first so Leaflet's later `map.remove()` is a no-op on DOM.
 */
export default function MapSafeTeardown() {
  const map = useMap();

  useEffect(() => {
    return () => {
      try {
        map.getContainer()?.remove();
      } catch {
        /* already detached */
      }
    };
  }, [map]);

  return null;
}
