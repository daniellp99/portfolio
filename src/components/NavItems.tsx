"use client";

import { useState, useTransition } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProjectSlugs } from "@/data/project-dto";
import { setLayouts } from "@/server/layouts";
import { tabs, TabsType } from "@/types/tabs";
import { MAIN_LAYOUTS_KEY } from "@/utils/constants";
import { generateLayouts } from "@/utils/layout";

export function NavItemsFallback() {
  return <Skeleton className="h-12 w-52" />;
}

export default function NavItems({
  projectsSlugs,
}: {
  projectsSlugs: ProjectSlugs;
}) {
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState(tabs[0]);

  return (
    <Tabs
      data-pending={pending}
      value={tab}
      onValueChange={(value) => {
        const layouts = generateLayouts(value as TabsType, projectsSlugs);
        startTransition(async () => {
          await setLayouts(layouts, MAIN_LAYOUTS_KEY);
        });
        setTab(value as TabsType);
      }}
      defaultValue={tab}
      className="flex flex-col items-center"
    >
      <TabsList className="h-12 w-fit rounded-full bg-card text-secondary-foreground ring-2 ring-border">
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="rounded-full text-xl">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
