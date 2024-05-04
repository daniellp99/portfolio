"use client";

import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { generateLayouts } from "@/actions";
import { TabsType, tabs } from "@/types/tabs";
import { useLayoutsContext } from "./LayoutsContext";

export default function NavItems() {
  const [tab, setTab] = useState(tabs[0]);
  const { setLayouts } = useLayoutsContext();

  return (
    <Tabs
      value={tab}
      onValueChange={async (value) => {
        const layouts = await generateLayouts(value as TabsType);
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
