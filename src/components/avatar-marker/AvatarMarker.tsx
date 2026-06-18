"use client";

import L from "leaflet";
import { useState } from "react";
import { Marker } from "react-leaflet";

import {
  AVATAR_MARKER_ROOT_ID,
  getAvatarMarkerDivIconOptions,
} from "@/lib/site/avatar-marker";
import { DEFAULT_CENTER } from "@/lib/site/constants";

import { AvatarMarkerPopover } from "./AvatarMarkerPopover";

export default function AvatarMarker({
  tooltip,
  markerRootId = AVATAR_MARKER_ROOT_ID,
}: {
  tooltip: string;
  markerRootId?: string;
}) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const icon = L.divIcon(getAvatarMarkerDivIconOptions(markerRootId));

  return (
    <>
      <Marker
        position={DEFAULT_CENTER}
        icon={icon}
        eventHandlers={{
          add: () => {
            setPortalTarget(document.getElementById(markerRootId));
          },
          remove: () => {
            setPortalTarget(null);
          },
        }}
      />
      {portalTarget ? (
        <AvatarMarkerPopover portalTarget={portalTarget} tooltip={tooltip} />
      ) : null}
    </>
  );
}
