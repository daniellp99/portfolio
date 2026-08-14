"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  type ColorScheme,
  themePreferenceForScheme,
} from "@/components/theme-preference";
import { PillTabs } from "@/components/ui/pill-tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { capture } from "@/lib/analytics";

const SCHEME_OPTIONS = ["light", "dark"] as const;

function isColorScheme(value: string): value is ColorScheme {
  return (SCHEME_OPTIONS as readonly string[]).includes(value);
}

export default function ThemeToggle() {
  const { resolvedTheme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="flex size-full items-center justify-center">
        <Skeleton className="cancelDrag h-10 w-full max-w-[calc(--spacing(10)*2+4px)] rounded-full" />
      </div>
    );
  }

  const activeScheme: ColorScheme =
    resolvedTheme === "dark" ? "dark" : "light";
  const systemScheme: ColorScheme =
    systemTheme === "dark" ? "dark" : "light";

  return (
    <div className="flex size-full items-center justify-center">
      <PillTabs.Root
        value={activeScheme}
        onValueChange={(value) => {
          if (!isColorScheme(value)) {
            return;
          }
          const preference = themePreferenceForScheme(value, systemScheme);
          setTheme(preference);
          capture("theme_selected", { theme: preference });
        }}
        className="cancelDrag"
      >
        <PillTabs.List size="compact" aria-label="Color theme">
          <PillTabs.Item value="light" aria-label="Light theme">
            <SunIcon aria-hidden />
          </PillTabs.Item>
          <PillTabs.Item value="dark" aria-label="Dark theme">
            <MoonIcon aria-hidden />
          </PillTabs.Item>
        </PillTabs.List>
      </PillTabs.Root>
    </div>
  );
}
