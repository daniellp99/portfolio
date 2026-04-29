"use client";
import { MapMarkerInfo } from "@/lib/server/project-dto";
import { DEFAULT_CENTER } from "@/lib/site/constants";
import L from "leaflet";
import Image from "next/image";
import {
  Activity,
  ViewTransition,
  startTransition,
  use,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Marker } from "react-leaflet";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function AvatarMarkerIcon({
  avatarMarker,
  avatarMarkerHover,
  tooltip,
  isActive,
  onActiveChange,
  markerRootId,
}: {
  avatarMarker: string;
  avatarMarkerHover: string;
  tooltip: string;
  isActive: boolean;
  onActiveChange: (next: boolean) => void;
  markerRootId: string;
}) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let raf = 0;
    function find() {
      const el = document.getElementById(markerRootId);
      if (el) {
        setPortalTarget(el);
        return;
      }
      raf = window.requestAnimationFrame(find);
    }
    find();
    return () => window.cancelAnimationFrame(raf);
  }, [markerRootId]);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <Tooltip open={isActive} onOpenChange={onActiveChange}>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={tooltip}
            className={cn(
              "group relative grid size-11 place-items-center p-0.5",
              "before:absolute before:inset-0 before:-z-10 before:-rotate-45 before:rounded-[999px_999px_999px_0] before:border before:border-foreground before:bg-foreground before:content-['']",
            )}
            onPointerEnter={() => startTransition(() => onActiveChange(true))}
            onPointerLeave={() => startTransition(() => onActiveChange(false))}
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
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>,
    portalTarget,
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

  const avatarMarker = mapMarkerInfo?.avatarMarker ?? "";
  const avatarMarkerHover = mapMarkerInfo?.avatarMarkerHover ?? "";
  const avatarMarkerTooltip = mapMarkerInfo?.avatarMarkerTooltip ?? "";

  if (!mapMarkerInfo) {
    return null;
  }

  return (
    <Marker position={DEFAULT_CENTER} ref={markerRef} icon={icon}>
      <AvatarMarkerIcon
        avatarMarker={avatarMarker}
        avatarMarkerHover={avatarMarkerHover}
        tooltip={avatarMarkerTooltip}
        isActive={isActive}
        onActiveChange={(next) =>
          setIsActive((prev) => (prev === next ? prev : next))
        }
        markerRootId={markerRootId}
      />
    </Marker>
  );
}
