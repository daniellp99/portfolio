"use client";
import { DEFAULT_CENTER } from "@/lib/site/constants";
import type { DivIcon, Marker as LeafletMarkerType } from "leaflet";
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { usePrefersFinePointer } from "@/hooks/use-prefers-fine-pointer";
import { cn } from "@/lib/utils";

import { MapMarkerInfo } from "@/lib/content/display";
import face1 from "../../public/face-1.webp";
import face2 from "../../public/face-2.webp";

const MarkerRootIdContext = createContext<string | null>(null);

export function AvatarMarkerIcon({
  mapMarkerInfo,
}: {
  mapMarkerInfo: MapMarkerInfo;
}) {
  const markerRootId = use(MarkerRootIdContext);

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

  const avatarMarkerTooltip = mapMarkerInfo.avatarMarkerTooltip;

  if (!markerRootId || !portalTarget) {
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
                  src={face1}
                  alt="Avatar marker"
                  width={40}
                  height={40}
                  className="pointer-events-none relative z-10 size-10 rounded-full object-cover"
                  draggable={false}
                />
              </ViewTransition>
            </Activity>

            <Activity mode={isActive ? "visible" : "hidden"}>
              <ViewTransition default="avatar-marker-fade">
                <Image
                  src={face2}
                  alt="Avatar marker hover"
                  width={40}
                  height={40}
                  className="pointer-events-none relative z-10 size-10 -translate-x-px rounded-full object-cover"
                  draggable={false}
                />
              </ViewTransition>
            </Activity>
          </button>
        }
      />
      <PopoverContent
        variant="tooltip"
        side="top"
        align="center"
        sideOffset={4}
      >
        {avatarMarkerTooltip}
      </PopoverContent>
    </Popover>,
    portalTarget,
  );
}

function useAvatarMarkerIcon(markerRootId: string): DivIcon | null {
  const [icon, setIcon] = useState<DivIcon | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((leaflet) => {
      if (cancelled) return;
      const size = 44;
      const tipY = Math.round(size / 2 + size / Math.SQRT2);
      setIcon(
        leaflet.default.divIcon({
          className: "avatar-marker-div-icon",
          html: `<div id="${markerRootId}" class="size-11"></div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, tipY],
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [markerRootId]);

  return icon;
}

export default function AvatarMarker({
  children,
}: {
  children: React.ReactNode;
}) {
  const markerRef = useRef<LeafletMarkerType | null>(null);
  const reactId = useId();
  const markerRootId = useMemo(
    () => `avatar-marker-${reactId.replace(/[:]/g, "")}`,
    [reactId],
  );
  const icon = useAvatarMarkerIcon(markerRootId);

  if (!icon) {
    return null;
  }

  return (
    <Marker position={DEFAULT_CENTER} ref={markerRef} icon={icon}>
      <MarkerRootIdContext value={markerRootId}>{children}</MarkerRootIdContext>
    </Marker>
  );
}
