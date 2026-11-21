"use client";

import { AvatarMarker } from "@/components/avatar-marker";

import MapRoot from "@/features/home/components/map/MapRoot";
import MapTiles from "@/features/home/components/map/MapTiles";
import MapZoomControls from "@/features/home/components/map/MapZoomControls";
import { AVATAR_MARKER_ROOT_ID } from "@/lib/site/avatar-marker";

/**
 * Full map island — leaflet/maplibre stay behind `MapCardClient`'s dynamic
 * import. Must remain a client module (MapContainer + imperative GL).
 */
export default function MapCardIsland({ tooltip }: { tooltip: string }) {
  return (
    <MapRoot>
      <MapTiles />
      <MapZoomControls />
      <AvatarMarker markerRootId={AVATAR_MARKER_ROOT_ID} tooltip={tooltip} />
    </MapRoot>
  );
}
