"use client";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Activity } from "react";
import { TileLayer } from "react-leaflet";

import { Skeleton } from "@/components/ui/skeleton";

import ZoomHandler from "@/components/ZoomHandler";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/site/constants";

const LeafletMapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  {
    ssr: false,
    loading() {
      return <Skeleton className="size-full" />;
    },
  },
);

export default function Map({ children }: { children: React.ReactNode }) {
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
        <TileLayer
          url={"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
        />
      </Activity>
      <Activity mode={resolvedTheme === "dark" ? "hidden" : "visible"}>
        <TileLayer
          url={"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
        />
      </Activity>
      {children}
    </LeafletMapContainer>
  );
}
