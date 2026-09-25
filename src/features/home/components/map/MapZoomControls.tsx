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
/** Match Leaflet’s default zoom feel without CSS-transform desync. */
const ZOOM_DURATION_MS = 250;

/** MapLibre GL Leaflet uses zoom = LeafletZoom - 1. */
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

    // Animate in MapLibre (real camera ease). Leaflet CSS zoomAnimation
    // scales the GL canvas then jumpTo-resyncs — that end snap is the jump.
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

  function handleZoomOut() {
    zoomTo(zoomLevel - ZOOM_DELTA);
  }
  function handleZoomIn() {
    zoomTo(zoomLevel + ZOOM_DELTA);
  }

  return (
    <div className="z-1000 flex justify-between self-end px-2 pb-2 [grid-area:'map']">
      <span
        className={cn(
          "cancelDrag invisible",
          zoomLevel !== map.getMinZoom() && "visible",
        )}
      >
        <Button
          variant="projectLink"
          size="icon-lg"
          aria-label="Zoom out"
          onClick={() => handleZoomOut()}
        >
          <MinusIcon className="size-6" />
        </Button>
      </span>

      <span
        className={cn(
          "cancelDrag invisible",
          zoomLevel !== map.getMaxZoom() && "visible",
        )}
      >
        <Button
          variant="projectLink"
          size="icon-lg"
          aria-label="Zoom in"
          onClick={() => handleZoomIn()}
        >
          <PlusIcon className="size-6" />
        </Button>
      </span>
    </div>
  );
}
