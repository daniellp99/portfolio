"use client";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

import { ColorSchemeMetaSync } from "@/components/ColorSchemeMetaSync";
import { ThemeHotkey } from "@/components/ThemeHotkey";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ColorSchemeMetaSync />
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  );
}
