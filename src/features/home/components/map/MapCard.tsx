import { MapCardClient } from "@/features/home/components/map/MapCardClient";

export function MapCard({ tooltip }: { tooltip: string }) {
  return (
    <div className="size-full" data-map-card="">
      <MapCardClient tooltip={tooltip} />
    </div>
  );
}
