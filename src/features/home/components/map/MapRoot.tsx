"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

import MapResizeSync from "@/features/home/components/map/MapResizeSync";

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

export default function MapRoot({ children }: { children: React.ReactNode }) {
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
      className="isolate grid size-full [grid-template-areas:'map']"
    >
      <MapResizeSync />
      {children}
    </LeafletMapContainer>
  );
}
