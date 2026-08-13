"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

import {
  type ColorScheme,
  nextThemePreference,
} from "@/components/theme-preference";
import { capture } from "@/lib/analytics";

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export function ThemeHotkey() {
  const { resolvedTheme, systemTheme, setTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) {
        return;
      }

      if (event.key.toLowerCase() !== "d") {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      event.preventDefault();
      const resolved: ColorScheme =
        resolvedTheme === "dark" ? "dark" : "light";
      const system: ColorScheme = systemTheme === "dark" ? "dark" : "light";
      const nextTheme = nextThemePreference(resolved, system);
      setTheme(nextTheme);
      capture("theme_selected", { theme: nextTheme });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resolvedTheme, systemTheme, setTheme]);

  return null;
}
