"use client";
import type { MapMarkerInfo } from "@/lib/server/project-dto";
import { DEFAULT_CENTER } from "@/lib/site/constants";
import L from "leaflet";
import Image from "next/image";
import {
  Activity,
  ViewTransition,
  createContext,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Marker } from "react-leaflet";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { usePrefersFinePointer } from "@/hooks/use-prefers-fine-pointer";
import { cn } from "@/lib/utils";

const MarkerRootIdContext = createContext<string | null>(null);

export function AvatarMarkerIcon({
  mapMarkerInfoPromise,
}: {
  mapMarkerInfoPromise: Promise<MapMarkerInfo>;
}) {
  const markerRootId = use(MarkerRootIdContext);
  const mapMarkerInfo = use(mapMarkerInfoPromise);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const openOnHover = usePrefersFinePointer();

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
    <Popover open={isActive} onOpenChange={setIsActive}>
      <PopoverTrigger
        openOnHover={openOnHover}
        delay={openOnHover ? 0 : undefined}
        closeDelay={openOnHover ? 0 : undefined}
        render={
          <button
            type="button"
            aria-label={avatarMarkerTooltip}
            className={cn(
              "group relative grid size-11 place-items-center p-0.5",
              "before:absolute before:inset-0 before:-z-10 before:-rotate-45 before:rounded-[50%_50%_50%_0] before:border before:border-foreground before:bg-foreground before:content-['']",
            )}
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
      <PopoverContent
        side="top"
        align="center"
        sideOffset={4}
        className={cn(
          "z-50 w-fit max-w-xs flex-col gap-0 rounded-md border-0 bg-foreground px-3 py-1.5 text-xs text-background shadow-md ring-0 duration-100 outline-none",
        )}
      >
        {avatarMarkerTooltip}
      </PopoverContent>
    </Popover>,
    portalTarget,
  );
}

export default function AvatarMarker({
  mapMarkerInfoPromise,
}: {
  mapMarkerInfoPromise: Promise<MapMarkerInfo>;
}) {
  const markerRef = useRef<L.Marker | null>(null);
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
    <Marker position={DEFAULT_CENTER} ref={markerRef} icon={icon}>
      <MarkerRootIdContext value={markerRootId}>
        <AvatarMarkerIcon mapMarkerInfoPromise={mapMarkerInfoPromise} />
      </MarkerRootIdContext>
    </Marker>
  );
}

export function AvatarMarkerSkeleton() {
  return (
    <Skeleton className="absolute top-1/2 left-1/2 z-100000 size-11 -translate-x-1/2 -translate-y-[calc(50%+30px)] -rotate-45 rounded-[50%_50%_50%_0] before:-inset-10 before:rotate-45" />
  );
}
