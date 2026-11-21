"use client";

import dynamic from "next/dynamic";
import { catchError } from "next/error";

import { Skeleton } from "@/components/ui/skeleton";

const MapCardIsland = dynamic(() => import("./MapCardIsland"), {
  ssr: false,
  loading() {
    return <MapCardSkeleton />;
  },
});

export function MapCardSkeleton() {
  return <Skeleton className="size-full" />;
}

/** Keep Leaflet/MapLibre teardown failures from taking down the whole page. */
const MapCardErrorBoundary = catchError(function MapCardErrorFallback() {
  return <MapCardSkeleton />;
});

/** Client-only map island: keeps maplibre/leaflet off the home render-dependent path. */
export function MapCard({ tooltip }: { tooltip: string }) {
  return (
    <MapCardErrorBoundary>
      <MapCardIsland tooltip={tooltip} />
    </MapCardErrorBoundary>
  );
}
