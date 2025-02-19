"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-full w-full items-center justify-items-center">
      <Button
        variant="themeToggle"
        size="icon"
        className="cancelDrag mx-auto h-12 w-20 p-1"
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      >
        <div className="size-9 -translate-x-4 rounded-full bg-card p-1 text-orange-300 transition duration-300 ease-linear dark:translate-x-4">
          <SunIcon className="block size-7 dark:hidden" />
          <MoonIcon className="hidden size-7 dark:block" />
        </div>
      </Button>
    </div>
  );
}
