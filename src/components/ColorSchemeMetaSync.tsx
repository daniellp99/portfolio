"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

import { colorSchemeMetaContent } from "@/components/theme-preference";

const META_NAME = "color-scheme";

/**
 * Keeps `<meta name="color-scheme">` in sync with next-themes after hydration.
 * FOUC priming lives in the layout head script; this covers runtime toggles
 * and cross-tab `storage` updates (next-themes already re-reads theme).
 */
export function ColorSchemeMetaSync() {
  const { theme } = useTheme();

  useEffect(() => {
    const meta = document.querySelector(`meta[name="${META_NAME}"]`);
    if (!(meta instanceof HTMLMetaElement)) {
      return;
    }
    meta.content = colorSchemeMetaContent(theme);
  }, [theme]);

  return null;
}
