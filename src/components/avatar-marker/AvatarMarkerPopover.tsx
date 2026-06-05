"use client";

import Image from "next/image";
import { Activity, ViewTransition, useState } from "react";
import { createPortal } from "react-dom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { usePrefersFinePointer } from "@/hooks/use-prefers-fine-pointer";
import { cn } from "@/lib/utils";

import face1 from "../../../public/face-1.webp";
import face2 from "../../../public/face-2.webp";

export function AvatarMarkerPopover({
  portalTarget,
  tooltip,
}: {
  portalTarget: HTMLElement;
  tooltip: string;
}) {
  const [isActive, setIsActive] = useState(false);
  const openOnHover = usePrefersFinePointer();

  return createPortal(
    <Popover open={isActive} onOpenChange={setIsActive}>
      <PopoverTrigger
        openOnHover={openOnHover}
        delay={openOnHover ? 0 : undefined}
        closeDelay={openOnHover ? 0 : undefined}
        render={
          <button
            type="button"
            aria-label={tooltip}
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
        {tooltip}
      </PopoverContent>
    </Popover>,
    portalTarget,
  );
}
