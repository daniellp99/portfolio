"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

import { colorSchemeMetaContent } from "@/components/theme-preference";

const META_NAME = "color-scheme";

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
