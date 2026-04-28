"use client";
import { MapMarkerInfo } from "@/lib/server/project-dto";
import { DEFAULT_CENTER } from "@/lib/site/constants";
import type L from "leaflet";
import { divIcon } from "leaflet";
import Image from "next/image";
import {
  Activity,
  startTransition,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  ViewTransition,
} from "react";
import { createPortal } from "react-dom";
import { Marker } from "react-leaflet";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function AvatarMarkerIcon({
  avatarMarker,
  avatarMarkerHover,
  tooltip,
  isActive,
  onActiveChange,
}: {
  avatarMarker: string;
  avatarMarkerHover: string;
  tooltip: string;
  isActive: boolean;
  onActiveChange: (next: boolean) => void;
}) {
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  function scheduleTransition(next: boolean) {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    // Base UI Tooltip may do sync layout work (flushSync) on open/close; starting the
    // ViewTransition one frame later avoids "flushSync cancelled View Transition" warnings.
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      startTransition(() => onActiveChange(next));
    });
  }

  return (
    <div className="relative size-[60px]">
      {/* Visuals ignore pointer: ViewTransition snapshots can break hit-testing on <img>. */}
      <div className="pointer-events-none absolute inset-0">
        <Activity mode={isActive ? "hidden" : "visible"}>
          <ViewTransition
            default="none"
            enter="avatar-marker-fade"
            exit="avatar-marker-fade"
          >
            {/* Next/Image fill requires a positioned parent; ViewTransition's host is static. */}
            <div className="relative size-full">
              <Image
                src={avatarMarker}
                alt=""
                fill
                sizes="60px"
                draggable={false}
                className="cancelDrag rounded-full object-cover drop-shadow-[0px_0px_4px] drop-shadow-foreground"
              />
            </div>
          </ViewTransition>
        </Activity>
        <Activity mode={isActive ? "visible" : "hidden"}>
          <ViewTransition
            default="none"
            enter="avatar-marker-fade"
            exit="avatar-marker-fade"
          >
            <div className="relative size-full">
              <Image
                src={avatarMarkerHover}
                alt=""
                fill
                sizes="60px"
                draggable={false}
                className="cancelDrag -translate-x-px rounded-full object-cover drop-shadow-[0px_0px_4px] drop-shadow-foreground"
              />
            </div>
          </ViewTransition>
        </Activity>
      </div>
      <TooltipProvider delay={5}>
        <Tooltip>
          <TooltipTrigger
            render={
              <div
                className="cancelDrag absolute inset-0 z-10 rounded-full"
                role="img"
                aria-label={tooltip}
                tabIndex={0}
                onMouseEnter={() => scheduleTransition(true)}
                onMouseLeave={() => scheduleTransition(false)}
                onFocus={() => scheduleTransition(true)}
                onBlur={() => scheduleTransition(false)}
              />
            }
          />
          <TooltipContent side="top">{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default function AvatarMarker({
  mapMarkerInfoPromise,
}: {
  mapMarkerInfoPromise: Promise<MapMarkerInfo>;
}) {
  const [isActive, setIsActive] = useState(false);
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
              tooltip={avatarMarkerTooltip}
              isActive={isActive}
              onActiveChange={(next) =>
                setIsActive((prev) => (prev === next ? prev : next))
              }
            />,
            mountEl,
          )
        : null}
    </Marker>
  );
}
