"use client";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { MapMarkerInfo } from "@/lib/server/project-dto";
import { DEFAULT_CENTER } from "@/lib/site/constants";
import { useTheme } from "next-themes";
import { Suspense } from "react";

const LeafletMapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false },
);
const LeafletTileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false },
);

const ZoomHandler = dynamic(() => import("@/components/ZoomHandler"), {
  ssr: false,
});

const AvatarMarker = dynamic(() => import("@/components/AvatarMarker"), {
  ssr: false,
});
export default function Map({
  mapMarkerInfoPromise,
}: {
  mapMarkerInfoPromise: Promise<MapMarkerInfo>;
}) {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  return (
    <LeafletMapContainer
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
      className="size-full"
    >
      <ZoomHandler />
      <LeafletTileLayer
        url={
          resolvedTheme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
      />
      <Suspense>
        <AvatarMarker mapMarkerInfoPromise={mapMarkerInfoPromise} />
      </Suspense>
    </LeafletMapContainer>
  );
}
