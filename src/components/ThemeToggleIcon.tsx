"use client";

/**
 * Sun / moon geometry matches Lucide icons (ISC, lucide.dev).
 * @see https://github.com/lucide-icons/lucide/blob/main/icons/sun.svg
 * @see https://github.com/lucide-icons/lucide/blob/main/icons/moon.svg
 */
import { motion, useReducedMotion } from "motion/react";

import { UI_SPRING } from "@/lib/motion";

const VIEW = 24;

/** Lucide `sun` icon node (circle + ray paths). */
const LUCIDE_SUN_PARTS = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "sun-disc" }],
  ["path", { d: "M12 2v2", key: "sun-ray-n" }],
  ["path", { d: "M12 20v2", key: "sun-ray-s" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "sun-ray-nw" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "sun-ray-se" }],
  ["path", { d: "M2 12h2", key: "sun-ray-w" }],
  ["path", { d: "M20 12h2", key: "sun-ray-e" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "sun-ray-sw" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "sun-ray-ne" }],
] as const;

/** Lucide `moon` icon path `d`. */
const LUCIDE_MOON_D =
  "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401";

type ThemeToggleIconProps = {
  isDark: boolean;
};

export function ThemeToggleIcon({ isDark }: ThemeToggleIconProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const transition = reduceMotion ? { duration: 0 } : UI_SPRING;

  const origin = `${VIEW / 2}px ${VIEW / 2}px`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="m-0.5 size-6 shrink-0"
      aria-hidden
    >
      <motion.g
        initial={false}
        animate={{
          opacity: isDark ? 0 : 1,
          scale: isDark ? 0.35 : 1,
          rotate: isDark ? 45 : 0,
        }}
        transition={transition}
        style={{ transformOrigin: origin }}
      >
        {LUCIDE_SUN_PARTS.map(([tag, attrs]) => {
          const { key, ...rest } = attrs;
          if (tag === "circle") {
            return <circle key={key} {...rest} />;
          }
          return <path key={key} {...rest} />;
        })}
      </motion.g>

      <motion.g
        initial={false}
        animate={{
          opacity: isDark ? 1 : 0,
          scale: isDark ? 1 : 0.65,
          rotate: isDark ? 0 : -28,
        }}
        transition={transition}
        style={{ transformOrigin: origin }}
      >
        <path d={LUCIDE_MOON_D} />
      </motion.g>
    </svg>
  );
}
