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
            className="group relative grid size-[60px] place-items-center rounded-full"
            onPointerEnter={() => startTransition(() => onActiveChange(true))}
            onPointerLeave={() => startTransition(() => onActiveChange(false))}
          >
            <Activity mode={isActive ? "hidden" : "visible"}>
              <ViewTransition default="avatar-marker-fade">
                <Image
                  src={avatarMarker}
                  alt=""
                  width={60}
                  height={60}
                  unoptimized
                  className="pointer-events-none size-[60px] rounded-full object-cover drop-shadow-[0px_0px_4px] drop-shadow-foreground"
                  draggable={false}
                />
              </ViewTransition>
            </Activity>

            <Activity mode={isActive ? "visible" : "hidden"}>
              <ViewTransition default="avatar-marker-fade">
                <Image
                  src={avatarMarkerHover}
                  alt=""
                  width={60}
                  height={60}
                  unoptimized
                  className="pointer-events-none size-[60px] -translate-x-px rounded-full object-cover drop-shadow-[0px_0px_4px] drop-shadow-foreground"
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
    const size = 60;
    return L.divIcon({
      className: "avatar-marker-div-icon",
      html: `<div id="${markerRootId}" class="size-[60px]"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
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
