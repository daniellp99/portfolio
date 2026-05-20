"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { use, useOptimistic, useTransition } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectSlugs } from "@/lib/content/display";
import { UI_SPRING } from "@/lib/motion";
import { getMainSearchParamsParsers } from "@/lib/schemas/search-params";
import { tabs, type TabsType } from "@/lib/site/tabs";
import { cn } from "@/lib/utils";
import { useQueryStates } from "nuqs";

export function NavItemsFallback() {
  return <Skeleton className="h-12 w-68.25 rounded-full" />;
}

export default function NavItems({
  projectsSlugsPromise,
}: {
  projectsSlugsPromise: Promise<ProjectSlugs>;
}) {
  const projectsSlugs = use(projectsSlugsPromise);
  const [pending, startTransition] = useTransition();
  const [{ tab }, setSearchParams] = useQueryStates(
    getMainSearchParamsParsers(projectsSlugs),
    { shallow: false, startTransition },
  );

  const [optimisticTab, setOptimisticTab] = useOptimistic(tab);
  const reduceMotion = useReducedMotion() ?? false;

  const indicatorTransition = reduceMotion ? { duration: 0 } : UI_SPRING;

  return (
    <Tabs
      data-pending={pending}
      value={optimisticTab}
      onValueChange={(value) => {
        const nextTab = value as TabsType;
        startTransition(() => {
          setOptimisticTab(nextTab);
          void setSearchParams({
            tab: nextTab,
            layout: null,
          });
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
              {optimisticTab === tabId ? (
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
