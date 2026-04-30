"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { ThemeToggleIcon } from "@/components/ThemeToggleIcon";
import { Button } from "@/components/ui/button";
import { UI_SPRING } from "@/lib/motion";

const KNOB_X = 18;

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  const knobTransition = reduceMotion ? { duration: 0 } : UI_SPRING;

  return (
    <motion.div
      className="flex size-full items-center justify-items-center"
      initial={false}
      animate={{ opacity: mounted ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.15 }}
    >
      <Button
        variant="themeToggle"
        size="icon-lg"
        className="cancelDrag mx-auto h-11 w-20 overflow-hidden p-0"
        disabled={!mounted}
        aria-busy={!mounted}
        aria-label={label}
        onClick={() => {
          setTheme(isDark ? "light" : "dark");
        }}
      >
        <motion.div
          className="size-9 rounded-full bg-foreground p-1 text-background"
          initial={false}
          animate={{ x: mounted ? (isDark ? KNOB_X : -KNOB_X) : -KNOB_X }}
          whileTap={mounted && !reduceMotion ? { scale: 0.97 } : undefined}
          transition={knobTransition}
        >
          <ThemeToggleIcon isDark={mounted && isDark} />
        </motion.div>
      </Button>
    </motion.div>
  );
}
