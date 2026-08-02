"use client";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

import { ThemeHotkey } from "@/components/ThemeHotkey";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  );
}
