"use client";

import type { Map as LeafletMap, MaplibreGL } from "leaflet";
import { MinusIcon, PlusIcon } from "lucide-react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useRef, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

import { Button } from "@/components/ui/button";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

const ZOOM_DELTA = 1;
const ZOOM_DURATION_MS = 250;

/** maplibre-gl-leaflet: MapLibreZoom = LeafletZoom - 1 */
function leafletZoomToMapLibre(zoom: number) {
  return zoom - 1;
}

function getMapLibreMap(map: LeafletMap): MapLibreMap | null {
  let glMap: MapLibreMap | null = null;
  map.eachLayer((layer) => {
    if (glMap) return;
    const candidate = layer as MaplibreGL;
    if (typeof candidate.getMaplibreMap === "function") {
      glMap = candidate.getMaplibreMap();
    }
  });
  return glMap;
}

export default function MapZoomControls() {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const zoomGenRef = useRef(0);

  useMapEvents({
    zoomend: () => {
      setZoomLevel(map.getZoom());
    },
  });

  function zoomTo(nextZoom: number) {
    const clamped = Math.min(
      map.getMaxZoom(),
      Math.max(map.getMinZoom(), nextZoom),
    );
    if (clamped === zoomLevel) return;

    const gen = ++zoomGenRef.current;
    setZoomLevel(clamped);

    const [lat, lng] = DEFAULT_CENTER;
    const glMap = getMapLibreMap(map);

    if (glMap) {
      glMap.stop();
      glMap.easeTo({
        center: [lng, lat],
        zoom: leafletZoomToMapLibre(clamped),
        duration: ZOOM_DURATION_MS,
        easing: (t) => 1 - (1 - t) ** 3,
      });
      glMap.once("moveend", () => {
        if (gen !== zoomGenRef.current) return;
        map.setView(DEFAULT_CENTER, clamped, { animate: false });
      });
      return;
    }

    map.setView(DEFAULT_CENTER, clamped, { animate: false });
  }

  const atMin = zoomLevel === map.getMinZoom();
  const atMax = zoomLevel === map.getMaxZoom();

  return (
    <div className="z-1000 flex justify-between self-end px-2 pb-2 [grid-area:'map']">
      <span className={cn("cancelDrag invisible", !atMin && "visible")}>
        <Button
          variant="projectLink"
          size="icon-lg"
          aria-label="Zoom out"
          onClick={() => zoomTo(zoomLevel - ZOOM_DELTA)}
        >
          <MinusIcon className="size-6" />
        </Button>
      </span>

      <span className={cn("cancelDrag invisible", !atMax && "visible")}>
        <Button
          variant="projectLink"
          size="icon-lg"
          aria-label="Zoom in"
          onClick={() => zoomTo(zoomLevel + ZOOM_DELTA)}
        >
          <PlusIcon className="size-6" />
        </Button>
      </span>
    </div>
  );
}
