"use client";

import { useEffect, useState, type TransitionEvent } from "react";

import { useSkillHoverTitle } from "@/components/SkillHoverContext";
import { cn } from "@/lib/utils";

export function SkillsHoverLabel() {
  const hoveredTitle = useSkillHoverTitle();
  const [displayTitle, setDisplayTitle] = useState<string | null>(null);

  if (hoveredTitle !== null && hoveredTitle !== displayTitle) {
    setDisplayTitle(hoveredTitle);
  }

  const show = hoveredTitle !== null;

  // `transition-none` under reduced motion never fires `transitionend`.
  useEffect(() => {
    if (show || displayTitle === null) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduced.matches) return;
    setDisplayTitle(null);
  }, [show, displayTitle]);

  function handleTransitionEnd(event: TransitionEvent<HTMLSpanElement>) {
    if (event.propertyName !== "opacity") return;
    if (event.target !== event.currentTarget) return;
    if (!show) setDisplayTitle(null);
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0.5 z-10 flex justify-center px-2"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {displayTitle !== null ? (
        <span
          style={{ transformOrigin: "top center" }}
          className={cn(
            "inline-flex h-10 max-w-[90%] items-center justify-center truncate rounded-full border-2 border-border bg-foreground px-3 text-center text-sm font-bold text-background ring-border transition-[opacity,translate] [transition-duration:var(--duration-spring)] [transition-timing-function:var(--ease-spring)] motion-reduce:transition-none",
            show
              ? "translate-y-0 opacity-100 starting:translate-y-[-0.25rem] starting:opacity-0"
              : "-translate-y-1 opacity-0",
          )}
          onTransitionEnd={handleTransitionEnd}
        >
          {displayTitle}
        </span>
      ) : null}
    </div>
  );
}
