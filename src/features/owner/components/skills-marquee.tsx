"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
