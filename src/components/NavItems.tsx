"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useState, useTransition } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { setLayouts } from "@/lib/actions/set-layouts";
import type { ProjectSlugs } from "@/lib/content/display";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import { generateLayouts } from "@/lib/site/grid";
import { tabs, TabsType } from "@/lib/site/tabs";

export function NavItemsFallback() {
  return <Skeleton className="h-12 w-68.25 rounded-full" />;
}

export default function NavItems({
  projectsSlugs,
}: {
  projectsSlugs: ProjectSlugs;
}) {
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const reduceMotion = useReducedMotion() ?? false;

  const indicatorTransition = reduceMotion ? { duration: 0 } : UI_SPRING;

  return (
    <Tabs
      data-pending={pending}
      value={activeTab}
      onValueChange={(value) => {
        const layouts = generateLayouts(value as TabsType, projectsSlugs);
        startTransition(async () => {
          await setLayouts(layouts, MAIN_LAYOUTS_KEY);
        });
        setActiveTab(value as TabsType);
      }}
      className="flex flex-col items-center"
    >
      <TabsList className="h-11 w-fit gap-1 rounded-full bg-card px-px py-0 text-secondary-foreground ring-2 ring-border">
        <LayoutGroup id="nav-tabs">
          {tabs.map((tabId) => (
            <TabsTrigger
              key={tabId}
              value={tabId}
              className={cn(
                "relative z-0 rounded-full px-4 text-xl data-active:bg-transparent data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent",
              )}
            >
              {activeTab === tabId ? (
                <motion.span
                  layoutId="nav-tab-indicator"
                  className="pointer-events-none absolute inset-0 z-0 rounded-full bg-foreground"
                  transition={indicatorTransition}
                />
              ) : null}
              <span className="relative z-10">{tabId}</span>
            </TabsTrigger>
          ))}
        </LayoutGroup>
      </TabsList>
    </Tabs>
  );
}
