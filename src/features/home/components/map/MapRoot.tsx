"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet";

import MapResizeSync from "@/features/home/components/map/MapResizeSync";
import MapSafeTeardown from "@/features/home/components/map/MapSafeTeardown";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/site/constants";

export default function MapRoot({ children }: { children: React.ReactNode }) {
  return (
    <MapContainer
      attributionControl={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
      // Leaflet CSS zoom scales the MapLibre canvas then jumpTo-resyncs
      // (visible end-snap). Zoom is animated via MapLibre easeTo instead.
      zoomAnimation={false}
      minZoom={1}
      zoomSnap={0.01}
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      maxZoom={16}
      className="isolate grid size-full [grid-template-areas:'map']"
    >
      <MapSafeTeardown />
      <MapResizeSync />
      {children}
    </MapContainer>
  );
}
