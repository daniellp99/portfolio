"use client";
import "leaflet/dist/leaflet.css";
import { usePathname } from "next/navigation";
import { MapContainer, TileLayer } from "react-leaflet";

import { DEFAULT_CENTER } from "@/utils/constants";
import { useTheme } from "next-themes";
import { AvatarMarker } from "./AvatarMarker";
import ZoomHandler from "./ZoomHandler";

export default function Map() {
  const { resolvedTheme } = useTheme();
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
      center={DEFAULT_CENTER}
      zoom={16}
      maxZoom={16}
      className="h-full w-full"
    >
      <ZoomHandler />
      <TileLayer
        url={
          resolvedTheme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
      />
      <AvatarMarker />
    </MapContainer>
  );
}
