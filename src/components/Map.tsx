"use client";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Activity, Suspense } from "react";

import { LoaderSkeleton } from "@/components/animations/skeleton";

import { MapMarkerInfo } from "@/lib/server/project-dto";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/site/constants";

const LeafletMapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  {
    ssr: false,
    loading() {
      return <LoaderSkeleton className="size-full" />;
    },
  },
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
      zoom={DEFAULT_ZOOM}
      maxZoom={16}
      className="size-full"
    >
      <ZoomHandler />

      <Activity mode={resolvedTheme === "dark" ? "visible" : "hidden"}>
        <LeafletTileLayer
          url={"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
        />
      </Activity>
      <Activity mode={resolvedTheme === "dark" ? "hidden" : "visible"}>
        <LeafletTileLayer
          url={"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
        />
      </Activity>
      <Suspense>
        <AvatarMarker mapMarkerInfoPromise={mapMarkerInfoPromise} />
      </Suspense>
    </LeafletMapContainer>
  );
}
