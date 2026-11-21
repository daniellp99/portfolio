"use client";

import "leaflet/dist/leaflet.css";
import { usePathname } from "next/navigation";
import { MapContainer } from "react-leaflet";

import MapResizeSync from "@/features/home/components/map/MapResizeSync";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/site/constants";

export default function MapRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <MapContainer
      // Use the pathname as the key to force a re-render when the pathname changes
      key={pathname}
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
      <MapResizeSync />
      {children}
    </MapContainer>
  );
}
