"use client";

import { use, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LayoutsContext } from "@/components/LayoutsContext";

import { ProjectSlugs } from "@/data/project-dto";
import { tabs, TabsType } from "@/types/tabs";
import { generateLayouts } from "@/utils/layout";

export function NavItemsFallback() {
  return <Skeleton className="h-12 w-52" />;
}

export default function NavItems({
  projectsSlugsPromise,
}: {
  projectsSlugsPromise: Promise<ProjectSlugs>;
}) {
  const [tab, setTab] = useState(tabs[0]);
  const { setLayouts } = use(LayoutsContext);
  const projectKeys = use(projectsSlugsPromise);

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        const layouts = generateLayouts(value as TabsType, projectKeys);
        setLayouts(layouts);
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
