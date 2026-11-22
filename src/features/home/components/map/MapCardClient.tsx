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

/** Keep Leaflet/MapLibre teardown failures from taking down the whole page. */
const MapCardErrorBoundary = catchError(function MapCardErrorFallback() {
  return <MapCardSkeleton />;
});

/**
 * Smallest client entry (bundle-dynamic-imports): error boundary + visibility
 * host + async MapLibre island. Literal `./MapCardIsland` path stays statically
 * analyzable (bundle-analyzable-paths).
 */
export function MapCardClient({ tooltip }: { tooltip: string }) {
  return (
    <MapCardErrorBoundary>
      <MapRenderGate>
        <MapCardIsland tooltip={tooltip} />
      </MapRenderGate>
    </MapCardErrorBoundary>
  );
}
