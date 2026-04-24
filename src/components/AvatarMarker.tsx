"use client";
import { MapMarkerInfo } from "@/lib/server/project-dto";
import { DEFAULT_CENTER } from "@/lib/site/constants";
import type L from "leaflet";
import { divIcon } from "leaflet";
import Image from "next/image";
import {
  startTransition,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  ViewTransition,
} from "react";
import { createPortal } from "react-dom";
import { Marker, Tooltip } from "react-leaflet";

function AvatarMarkerIcon({
  avatarMarker,
  avatarMarkerHover,
  isHovered,
  onHoverChange,
}: {
  avatarMarker: string;
  avatarMarkerHover: string;
  isHovered: boolean;
  onHoverChange: (next: boolean) => void;
}) {
  const src = isHovered ? avatarMarkerHover : avatarMarker;
  return (
    <div className="relative size-[60px]">
      {/* Visuals ignore pointer: ViewTransition snapshots can break hit-testing on <img>. */}
      <div className="pointer-events-none absolute inset-0">
        <ViewTransition default="avatar-marker-fade">
          {/* Next/Image fill requires a positioned parent; ViewTransition's host is static. */}
          <div className="relative size-full">
            <Image
              src={src}
              alt=""
              fill
              sizes="60px"
              draggable={false}
              className="cancelDrag rounded-full object-cover drop-shadow-[0px_0px_4px] drop-shadow-foreground"
            />
          </div>
        </ViewTransition>
      </div>
      <div
        className="cancelDrag absolute inset-0 z-10 rounded-full"
        aria-hidden
        onMouseEnter={() => startTransition(() => onHoverChange(true))}
        onMouseLeave={() => startTransition(() => onHoverChange(false))}
      />
    </div>
  );
}

export default function AvatarMarker({
  mapMarkerInfoPromise,
}: {
  mapMarkerInfoPromise: Promise<MapMarkerInfo>;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const mapMarkerInfo = use(mapMarkerInfoPromise);
  const markerRef = useRef<L.Marker | null>(null);
  const [mountEl, setMountEl] = useState<HTMLElement | null>(null);

  const avatarMarker = mapMarkerInfo?.avatarMarker ?? "";
  const avatarMarkerHover = mapMarkerInfo?.avatarMarkerHover ?? "";
  const avatarMarkerTooltip = mapMarkerInfo?.avatarMarkerTooltip ?? "";

  const avatarIcon = useMemo(
    () =>
      divIcon({
        className: "avatar-marker-icon",
        iconSize: [60, 60],
        iconAnchor: [30, 60],
        tooltipAnchor: [3, -60],
        html: '<div class="avatar-marker-react-root"></div>',
      }),
    [],
  );

  useEffect(() => {
    let rafId: number | null = null;

    const findMountEl = () => {
      const marker = markerRef.current;
      const el = marker?.getElement();
      const nextMountEl = el?.querySelector<HTMLElement>(
        ".avatar-marker-react-root",
      );
      if (!nextMountEl) {
        rafId = requestAnimationFrame(findMountEl);
        return;
      }
      setMountEl(nextMountEl);
    };

    findMountEl();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      setMountEl(null);
    };
  }, []);

  if (!mapMarkerInfo) {
    return null;
  }

  return (
    <Marker position={DEFAULT_CENTER} icon={avatarIcon} ref={markerRef}>
      {mountEl
        ? createPortal(
            <AvatarMarkerIcon
              avatarMarker={avatarMarker}
              avatarMarkerHover={avatarMarkerHover}
              isHovered={isHovered}
              onHoverChange={(next) =>
                setIsHovered((prev) => (prev === next ? prev : next))
              }
            />,
            mountEl,
          )
        : null}
      <Tooltip direction="top">{avatarMarkerTooltip}</Tooltip>
    </Marker>
  );
}
