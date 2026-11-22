import { MapCardClient } from "@/features/home/components/map/MapCardClient";

export { MapCardSkeleton } from "@/features/home/components/map/MapCardSkeleton";

/**
 * Server shell for the map card (server-serialization: only `tooltip` crosses
 * the RSC → client boundary). Leaflet/MapLibre stay in `MapCardClient`.
 */
export function MapCard({ tooltip }: { tooltip: string }) {
  return (
    <div className="size-full" data-map-card="">
      <MapCardClient tooltip={tooltip} />
    </div>
  );
}
