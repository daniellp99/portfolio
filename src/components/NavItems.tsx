"use client";

import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { key: "all", name: "All" },
  { key: "about", name: "About" },
  { key: "projects", name: "Projects" },
];

export default function NavItems() {
  const [tab, setTab] = useState(TABS[0].key);

  const onTabChange = (value: string) => {
    setTab(value);
  };
  return (
    <Tabs
      value={tab}
      onValueChange={onTabChange}
      defaultValue={TABS[0].key}
      className="flex w-full flex-col items-center"
    >
      <TabsList className="ring-border text-secondary-foreground h-12 w-fit rounded-full ring-2">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className="rounded-full text-xl"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
