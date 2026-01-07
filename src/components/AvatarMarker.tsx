"use client";
import { MapMarkerInfo } from "@/data/project-dto";
import { DEFAULT_CENTER } from "@/utils/constants";
import { icon } from "leaflet";
import { use, useState } from "react";
import { Marker, Tooltip } from "react-leaflet";

export default function AvatarMarker({
  mapMarkerInfoPromise,
}: {
  mapMarkerInfoPromise: Promise<MapMarkerInfo>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const mapMarkerInfo = use(mapMarkerInfoPromise);

  if (!mapMarkerInfo) {
    return null;
  }
  const { avatarMarker, avatarMarkerHover, avatarMarkerTooltip } =
    mapMarkerInfo;

  const avatarIcon = icon({
    iconUrl: avatarMarker,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    tooltipAnchor: [3, -60],
    className:
      "cancelDrag drop-shadow-[0px_0px_4px] drop-shadow-foreground transition-all",
  });

  const avatarIconHover = icon({
    iconUrl: avatarMarkerHover,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    tooltipAnchor: [3, -60],
    className:
      "cancelDrag drop-shadow-[0px_0px_4px] drop-shadow-foreground transition-all",
  });

  return (
    <Marker
      position={DEFAULT_CENTER}
      icon={isHovered ? avatarIconHover : avatarIcon}
      eventHandlers={{
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false),
      }}
    >
      <Tooltip direction="top">{avatarMarkerTooltip}</Tooltip>
    </Marker>
  );
}
