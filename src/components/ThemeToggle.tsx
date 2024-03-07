"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, systemTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    systemTheme && setTheme(systemTheme);
  }, [systemTheme, setTheme]);

  if (!mounted) {
    return null;
  }

  const ThemeIcon = resolvedTheme === "light" ? SunIcon : MoonIcon;

  return (
    <div className="flex h-full w-full items-center justify-items-center">
      <Button
        variant="themeToggle"
        size="icon"
        value={resolvedTheme}
        className="cancelDrag mx-auto h-12 w-20 p-1"
        onClick={() => {
          setTheme(resolvedTheme === "light" ? "dark" : "light");
        }}
      >
        <div className="size-9 -translate-x-4 rounded-full bg-card p-1 text-orange-300 transition duration-300 ease-linear dark:translate-x-4">
          <ThemeIcon className="size-7" />
        </div>
      </Button>
    </div>
  );
}
