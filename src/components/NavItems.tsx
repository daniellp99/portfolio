"use client";

import { use, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabsType, tabs } from "@/types/tabs";
import { generateLayouts } from "@/utils/layout";
import { LayoutsContext } from "./LayoutsContext";

export default function NavItems({ projectKeys }: { projectKeys: string[] }) {
  const [tab, setTab] = useState(tabs[0]);
  const { setLayouts } = use(LayoutsContext);

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
          <TabsTrigger
            key={tab}
            value={tab}
            className="rounded-full text-xl data-[state=active]:bg-foreground data-[state=active]:text-background"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
