export const AVATAR_MARKER_ROOT_ID = "avatar-marker-root";

const AVATAR_MARKER_SIZE = 44;
const AVATAR_MARKER_DIV_ICON_CLASS = "avatar-marker-div-icon";

export type AvatarMarkerDivIconOptions = {
  className: string;
  html: string;
  iconSize: [number, number];
  iconAnchor: [number, number];
};

/** Anchor at the pin tip (bottom point of the rotated square). */
function avatarMarkerIconAnchor(size: number): [number, number] {
  const tipY = Math.round(size / 2 + size / Math.SQRT2);
  return [size / 2, tipY];
}

/** Empty mount node for Leaflet divIcon; React portals replace its contents. */
export function getAvatarMarkerDivIconOptions(
  markerRootId: string = AVATAR_MARKER_ROOT_ID,
): AvatarMarkerDivIconOptions {
  return {
    className: AVATAR_MARKER_DIV_ICON_CLASS,
    html: `<div id="${markerRootId}" class="size-11"></div>`,
    iconSize: [AVATAR_MARKER_SIZE, AVATAR_MARKER_SIZE],
    iconAnchor: avatarMarkerIconAnchor(AVATAR_MARKER_SIZE),
  };
}
