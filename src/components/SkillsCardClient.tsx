"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { LogoCarousel } from "@/components/LogoCarousel";
import {
  SkillHoverProvider,
  useSkillHover,
} from "@/components/SkillHoverContext";

import type { Logo } from "@/lib/content/schemas";

function SkillsHoverLabel() {
  const { hoveredTitle } = useSkillHover();
  const reduceMotion = useReducedMotion() ?? false;

  const transition = reduceMotion
    ? { duration: 0 }
    : {
        opacity: {
          type: "tween" as const,
          ease: "easeOut" as const,
          duration: 0.2,
        },
        y: {
          type: "tween" as const,
          ease: "easeOut" as const,
          duration: 0.16,
        },
      };

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-2"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {hoveredTitle ? (
          <motion.span
            key={hoveredTitle}
            style={{ transformOrigin: "top center" }}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={transition}
            className="inline-flex h-10 max-w-[90%] items-center justify-center truncate rounded-full border-2 border-border bg-foreground px-3 text-center text-sm font-bold text-background ring-border"
          >
            {hoveredTitle}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function SkillsCardClient({ logos }: { logos: Logo[] }) {
  return (
    <SkillHoverProvider>
      <div className="relative isolate flex size-full flex-col items-center justify-evenly">
        <SkillsHoverLabel />
        <LogoCarousel logos={logos} opts={{ direction: "ltr" }} />
        <LogoCarousel logos={logos} opts={{ direction: "rtl" }} />
      </div>
    </SkillHoverProvider>
  );
}
