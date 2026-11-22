"use client";

import dynamic from "next/dynamic";
import { catchError } from "next/error";

import { MapCardSkeleton } from "@/features/home/components/map/MapCardSkeleton";
import { MapRenderGate } from "@/features/home/components/map/MapRenderGate";

const MapCardIsland = dynamic(() => import("./MapCardIsland"), {
  ssr: false,
  loading() {
    return <MapCardSkeleton />;
  },
});

const MapCardErrorBoundary = catchError(function MapCardErrorFallback() {
  return <MapCardSkeleton />;
});

export function MapCardClient({ tooltip }: { tooltip: string }) {
  return (
    <MapCardErrorBoundary>
      <MapRenderGate>
        <MapCardIsland tooltip={tooltip} />
      </MapRenderGate>
    </MapCardErrorBoundary>
  );
}
