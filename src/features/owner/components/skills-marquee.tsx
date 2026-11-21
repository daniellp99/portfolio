"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shared pause/play for the skills logo marquees (WCAG 2.2.2 / motion guide).
 * Hover and focus-within still pause temporarily; this control is durable.
 * Icon-only: accessible name swaps Play/Pause — do not also set aria-pressed.
 * Corner inset + projectLink chrome match other home card controls
 * (project cards use absolute bottom-2 left-2).
 */
export function SkillsMarquee({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={cn(
        "relative isolate flex size-full flex-col items-center justify-evenly",
        paused && "logo-marquee-paused",
      )}
    >
      {children}
      <span className="cancelDrag absolute bottom-2 left-2 z-10">
        <Button
          type="button"
          variant="projectLink"
          size="icon-lg"
          aria-label={paused ? "Play animation" : "Pause animation"}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? (
            <PlayIcon aria-hidden className="size-5" />
          ) : (
            <PauseIcon aria-hidden className="size-5" />
          )}
        </Button>
      </span>
    </div>
  );
}
