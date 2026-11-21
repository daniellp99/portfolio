"use client";

import dynamic from "next/dynamic";

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

/** Client-only map island: keeps maplibre/leaflet off the home render-dependent path. */
export function MapCard({ tooltip }: { tooltip: string }) {
  return <MapCardIsland tooltip={tooltip} />;
}
