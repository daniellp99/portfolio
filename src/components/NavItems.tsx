"use client";

import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabsType, tabs } from "@/types/tabs";
import { useLayoutsContext } from "./LayoutsContext";
import { generateLayouts } from "@/utils/layout";

export default function NavItems({ projectKeys }: { projectKeys: string[] }) {
  const [tab, setTab] = useState(tabs[0]);
  const { setLayouts } = useLayoutsContext();

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        const layouts = generateLayouts(value as TabsType, projectKeys);
        setLayouts(layouts);
        setTab(value as TabsType);
      }}
      defaultValue={tab}
      className="flex w-full flex-col items-center"
    >
      <TabsList className="h-12 w-fit rounded-full text-secondary-foreground ring-2 ring-border">
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="rounded-full text-xl">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
