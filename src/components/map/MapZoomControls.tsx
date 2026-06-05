"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

import { Button } from "@/components/ui/button";

import { DEFAULT_ZOOM } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

export default function MapZoomControls() {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });

  function handleZoomOut() {
    map.zoomOut();
  }
  function handleZoomIn() {
    map.zoomIn();
  }

  return (
    <div className="z-1000 flex justify-between self-end px-2 pb-2 [grid-area:'map']">
      <Button
        variant="projectLink"
        size="icon-lg"
        aria-label="Zoom out"
        onClick={() => handleZoomOut()}
        className={cn(
          "cancelDrag invisible transition-[transform,opacity,box-shadow,filter] duration-150 ease-linear",
          zoomLevel !== map.getMinZoom() && "visible",
        )}
      >
        <MinusIcon className="size-6" />
      </Button>

      <Button
        variant="projectLink"
        size="icon-lg"
        aria-label="Zoom in"
        onClick={() => handleZoomIn()}
        className={cn(
          "cancelDrag invisible transition-[transform,opacity,box-shadow,filter] duration-150 ease-linear",
          zoomLevel !== map.getMaxZoom() && "visible",
        )}
      >
        <PlusIcon className="size-6" />
      </Button>
    </div>
  );
}
