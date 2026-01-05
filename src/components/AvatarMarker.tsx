"use client";
import { DEFAULT_CENTER } from "@/utils/constants";
import { icon } from "leaflet";
import { Marker, Tooltip } from "react-leaflet";

export function AvatarMarker() {
  const avatarIcon = icon({
    iconUrl: "/Avatar.webp",
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    tooltipAnchor: [3, -60],
    className:
      "cancelDrag dark:drop-shadow-[0px_0px_4px] dark:drop-shadow-foreground transition-all",
  });
  return (
    <Marker position={DEFAULT_CENTER} icon={avatarIcon}>
      <Tooltip direction="top">Qué bolá, asere</Tooltip>
    </Marker>
  );
}
