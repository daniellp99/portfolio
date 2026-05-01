"use client";
import type { MapMarkerInfo } from "@/lib/server/project-dto";
import { DEFAULT_CENTER } from "@/lib/site/constants";
import L from "leaflet";
import Image from "next/image";
import {
  Activity,
  ViewTransition,
  createContext,
  startTransition,
  use,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const MarkerRootIdContext = createContext<string | null>(null);

const LeafletMarker = dynamic(
  async () => (await import("react-leaflet")).Marker,
  { ssr: false },
);

export function AvatarMarkerIcon({
  mapMarkerInfoPromise,
}: {
  mapMarkerInfoPromise: Promise<MapMarkerInfo>;
}) {
  const markerRootId = use(MarkerRootIdContext);
  const mapMarkerInfo = use(mapMarkerInfoPromise);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const id = markerRootId;
    if (!id) return;
    let raf = 0;
    function find(markerId: string) {
      const el = document.getElementById(markerId);
      if (el) {
        setPortalTarget(el);
        return;
      }
      raf = window.requestAnimationFrame(() => find(markerId));
    }
    find(id);
    return () => window.cancelAnimationFrame(raf);
  }, [markerRootId]);

  const avatarMarker = mapMarkerInfo?.avatarMarker ?? "";
  const avatarMarkerHover = mapMarkerInfo?.avatarMarkerHover ?? "";
  const avatarMarkerTooltip = mapMarkerInfo?.avatarMarkerTooltip ?? "";

  if (!markerRootId || !portalTarget || !mapMarkerInfo) {
    return null;
  }

  return createPortal(
    <Tooltip open={isActive} onOpenChange={setIsActive}>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={avatarMarkerTooltip}
            className={cn(
              "group relative grid size-11 place-items-center p-0.5",
              "before:absolute before:inset-0 before:-z-10 before:-rotate-45 before:rounded-[50%_50%_50%_0] before:border before:border-foreground before:bg-foreground before:content-['']",
            )}
            onPointerEnter={() => startTransition(() => setIsActive(true))}
            onPointerLeave={() => startTransition(() => setIsActive(false))}
          >
            <Activity mode={isActive ? "hidden" : "visible"}>
              <ViewTransition default="avatar-marker-fade">
                <Image
                  src={avatarMarker}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="pointer-events-none relative z-10 size-10 rounded-full object-cover"
                  draggable={false}
                />
              </ViewTransition>
            </Activity>

            <Activity mode={isActive ? "visible" : "hidden"}>
              <ViewTransition default="avatar-marker-fade">
                <Image
                  src={avatarMarkerHover}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="pointer-events-none relative z-10 size-10 -translate-x-px rounded-full object-cover"
                  draggable={false}
                />
              </ViewTransition>
            </Activity>
          </button>
        }
      />
      <TooltipContent side="top">{avatarMarkerTooltip}</TooltipContent>
    </Tooltip>,
    portalTarget,
  );
}

export default function AvatarMarker({
  mapMarkerInfoPromise,
}: {
  mapMarkerInfoPromise: Promise<MapMarkerInfo>;
}) {
  const reactId = useId();
  const markerRootId = useMemo(
    () => `avatar-marker-${reactId.replace(/[:]/g, "")}`,
    [reactId],
  );
  const icon = useMemo(() => {
    // Visual marker is a square rotated -45deg, whose tip extends past the box.
    // For a square of side `size` rotated 45deg, the bottom tip is at:
    // y = size/2 + size/sqrt(2) from the top-left origin of the unrotated box.
    const size = 44; // Tailwind `size-11`
    const tipY = Math.round(size / 2 + size / Math.SQRT2);
    return L.divIcon({
      className: "avatar-marker-div-icon",
      html: `<div id="${markerRootId}" class="size-11"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, tipY],
    });
  }, [markerRootId]);

  return (
    <LeafletMarker position={DEFAULT_CENTER} icon={icon}>
      <MarkerRootIdContext value={markerRootId}>
        <AvatarMarkerIcon mapMarkerInfoPromise={mapMarkerInfoPromise} />
      </MarkerRootIdContext>
    </LeafletMarker>
  );
}
