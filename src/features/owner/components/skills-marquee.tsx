"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shared pause/play for the skills logo marquees (WCAG 2.2.2 / motion guide).
 * Hover and focus-within still pause temporarily; this control is durable.
 * Label swaps between Pause and Play — do not also set aria-pressed.
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
      <Button
        type="button"
        variant="outline"
        size="xs"
        className="absolute right-1 bottom-1 z-10"
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? (
          <>
            <PlayIcon aria-hidden />
            Play animation
          </>
        ) : (
          <>
            <PauseIcon aria-hidden />
            Pause animation
          </>
        )}
      </Button>
    </div>
  );
}
