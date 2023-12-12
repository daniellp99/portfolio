"use client";
import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export default function ZoomHandler() {
  const map = useMap();
  const [zoomLevel, setZoomLevel] = useState(16);

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
    <div className="absolute bottom-2 z-[10000] w-full">
      <div className="relative mx-2 flex">
        {zoomLevel !== map.getMinZoom() && (
          <button
            onClick={() => handleZoomOut()}
            className="cancelDrag absolute bottom-0 left-0 rounded-full border-2 bg-white hover:scale-110 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-10 w-10"
            >
              <path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
            </svg>
          </button>
        )}
        {zoomLevel !== map.getMaxZoom() && (
          <button
            onClick={() => handleZoomIn()}
            className="cancelDrag absolute bottom-0 right-0  rounded-full border-2 bg-white  hover:scale-110 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-10 w-10"
            >
              <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
