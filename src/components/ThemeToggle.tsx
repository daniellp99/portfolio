"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { PillTabs } from "@/components/ui/pill-tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { capture } from "@/lib/analytics";

const THEME_OPTIONS = ["light", "system", "dark"] as const;
type ThemeOption = (typeof THEME_OPTIONS)[number];

function isThemeOption(value: string): value is ThemeOption {
  return (THEME_OPTIONS as readonly string[]).includes(value);
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <div className="flex size-full items-center justify-center">
        <Skeleton className="cancelDrag mx-auto h-11 w-full max-w-28 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex size-full items-center justify-center">
      <PillTabs.Root
        layoutGroupId="theme-switch"
        value={theme ?? "system"}
        onValueChange={(value) => {
          if (!isThemeOption(value)) {
            return;
          }
          setTheme(value);
          capture("theme_selected", { theme: value });
        }}
        className="cancelDrag mx-auto w-full max-w-28"
      >
        <PillTabs.List
          size="compact"
          aria-label="Color theme"
          className="w-full"
        >
          <PillTabs.Item value="light" aria-label="Light theme">
            <SunIcon aria-hidden />
          </PillTabs.Item>
          <PillTabs.Item value="system" aria-label="System theme">
            <MonitorIcon aria-hidden />
          </PillTabs.Item>
          <PillTabs.Item value="dark" aria-label="Dark theme">
            <MoonIcon aria-hidden />
          </PillTabs.Item>
        </PillTabs.List>
      </PillTabs.Root>
    </div>
  );
}
