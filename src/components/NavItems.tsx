"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useOptimistic, useTransition } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { switchMainGridTab } from "@/lib/actions/switch-main-grid-tab";
import { UI_SPRING } from "@/lib/motion";
import { tabs, type TabsType } from "@/lib/site/tabs";
import { cn } from "@/lib/utils";

export default function NavItemsClient({
  initialActiveTab,
}: {
  initialActiveTab: TabsType;
}) {
  const [pending, startTransition] = useTransition();
  const [activeTab, setOptimisticTab] = useOptimistic(
    initialActiveTab,
    (_current, next: TabsType) => next,
  );
  const reduceMotion = useReducedMotion() ?? false;

  const indicatorTransition = reduceMotion ? { duration: 0 } : UI_SPRING;

  return (
    <Tabs
      data-pending={pending}
      value={activeTab}
      onValueChange={(value) => {
        const tab = value as TabsType;
        startTransition(async () => {
          setOptimisticTab(tab);
          await switchMainGridTab(tab);
        });
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
