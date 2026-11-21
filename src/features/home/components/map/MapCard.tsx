import { MapCardClient } from "@/features/home/components/map/MapCardClient";

export { MapCardSkeleton } from "@/features/home/components/map/MapCardSkeleton";

/**
 * Server shell for the map card. Layout/skeleton stay on the RSC path;
 * Leaflet/MapLibre load only inside the client island (`MapCardClient`).
 */
export function MapCard({ tooltip }: { tooltip: string }) {
  return (
    <div className="size-full" data-map-card="">
      <MapCardClient tooltip={tooltip} />
    </div>
  );
}
