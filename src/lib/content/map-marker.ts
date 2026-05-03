import type { MapMarkerInfo } from "./display";
import type { OwnerData } from "./schemas";

export function mapOwnerToMapMarkerInfo(
  ownerData: OwnerData | null,
): MapMarkerInfo | null {
  if (!ownerData) return null;
  return {
    avatarMarker: ownerData.avatarMarker,
    avatarMarkerHover: ownerData.avatarMarkerHover,
    avatarMarkerTooltip: ownerData.avatarMarkerTooltip,
  };
}
