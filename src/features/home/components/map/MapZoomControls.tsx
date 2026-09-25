"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

import { Button } from "@/components/ui/button";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

const ZOOM_DELTA = 1;

export default function MapZoomControls() {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });

  function zoomTo(nextZoom: number) {
    // Always re-center on the marker; MapLibre sync can drift the view
    // when using zoomIn/zoomOut around a shifted center.
    map.setView(DEFAULT_CENTER, nextZoom, { animate: false });
  }

  function handleZoomOut() {
    zoomTo(map.getZoom() - ZOOM_DELTA);
  }
  function handleZoomIn() {
    zoomTo(map.getZoom() + ZOOM_DELTA);
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
