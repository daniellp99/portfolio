"use client";

import { Activity } from "react";

import AvatarMarker from "@/components/avatar-marker/AvatarMarker";

import MapRoot from "@/features/home/components/map/MapRoot";
import { useMapVisibility } from "@/features/home/components/map/map-visibility";
import MapTiles from "@/features/home/components/map/MapTiles";
import MapZoomControls from "@/features/home/components/map/MapZoomControls";
import { AVATAR_MARKER_ROOT_ID } from "@/lib/site/avatar-marker";

/**
 * Full map island behind `MapCardClient`'s dynamic import.
 *
 * rendering-activity: `<Activity>` wraps MapRoot *after* the lazy chunk
 * resolves so pause tears down GL Effects while preserving zoom state, without
 * trapping `next/dynamic` Suspense / BailoutToCSR.
 */
export default function MapCardIsland({ tooltip }: { tooltip: string }) {
  const visible = useMapVisibility();

  return (
    <Activity mode={visible ? "visible" : "hidden"}>
      <MapRoot>
        <MapTiles />
        <MapZoomControls />
        <AvatarMarker markerRootId={AVATAR_MARKER_ROOT_ID} tooltip={tooltip} />
      </MapRoot>
    </Activity>
  );
}
