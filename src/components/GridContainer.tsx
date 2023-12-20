"use client";

import dynamic from "next/dynamic";
import { Responsive, WidthProvider } from "react-grid-layout";

import ThemeToggle from "./ThemeToggle";

const LAYOUTS = {
  fourColumnsLg: [
    { i: "me", x: 0, y: 0, w: 2, h: 1.645, isResizable: false },
    { i: "toggle-theme", x: 2, y: 0, w: 1, h: 1.645, isResizable: false },
    { i: "maps", x: 2, y: 0, w: 1, h: 1.645, isResizable: false },
    { i: "social-links", x: 3, y: 0, w: 1, h: 1.645, isResizable: false },
    { i: "project-1", x: 0, y: 1, w: 2, h: 3.29, isResizable: false },
    { i: "project-2", x: 2, y: 1, w: 2, h: 3.29, isResizable: false },
    { i: "project-3", x: 2, y: 1, w: 2, h: 3.29, isResizable: false },
  ],
  fourColumnsSm: [
    { i: "me", x: 0, y: 0, w: 2, h: 1.09, isResizable: false },
    { i: "toggle-theme", x: 2, y: 0, w: 1, h: 1.09, isResizable: false },
    { i: "maps", x: 2, y: 0, w: 1, h: 1.09, isResizable: false },
    { i: "social-links", x: 3, y: 0, w: 1, h: 1.09, isResizable: false },
    { i: "project-1", x: 0, y: 1, w: 2, h: 2.18, isResizable: false },
    { i: "project-2", x: 2, y: 1, w: 2, h: 2.18, isResizable: false },
    { i: "project-3", x: 2, y: 1, w: 2, h: 2.18, isResizable: false },
  ],
  twoColumns: [
    { i: "me", x: 0, y: 0, w: 2, h: 1, isResizable: false },
    { i: "toggle-theme", x: 1, y: 2, w: 1, h: 1, isResizable: false },
    { i: "maps", x: 1, y: 2, w: 1, h: 1, isResizable: false },
    { i: "social-links", x: 0, y: 3, w: 1, h: 1, isResizable: false },
    { i: "project-1", x: 0, y: 1, w: 1, h: 2, isResizable: false },
    { i: "project-2", x: 1, y: 2, w: 1, h: 2, isResizable: false },
    { i: "project-3", x: 0, y: 4, w: 2, h: 1, isResizable: false },
  ],
};

const ResponsiveGridLayout = WidthProvider(Responsive);

const DynamicMap = dynamic(() => import("@/components/Map"), {
  loading: () => (
    <div className="h-full w-full animate-pulse bg-zinc-200 dark:bg-zinc-600" />
  ),
  ssr: false,
});

export default function GridContainer() {
  const layouts = {
    lg: LAYOUTS.fourColumnsLg,
    md: LAYOUTS.fourColumnsLg,
    sm: LAYOUTS.fourColumnsSm,
    xs: LAYOUTS.twoColumns,
  };
  return (
    <ResponsiveGridLayout
      draggableCancel=".cancelDrag"
      className="layout animate-fade-in"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 4, md: 4, sm: 4, xs: 2, xxs: 2 }}
      rowHeight={164}
      containerPadding={{
        xxs: [15.5, 15.5],
        xs: [15.5, 15.5],
        sm: [16, 16],
        md: [16, 16],
      }}
      margin={{
        xxs: [15.5, 15.5],
        xs: [15.5, 15.5],
        sm: [16, 16],
        md: [16, 16],
      }}
      // isBounded={true}
    >
      <div className="grid-item-container" key="me">
        <p>Me</p>
      </div>
      <div className="grid-item-container" key="toggle-theme">
        <ThemeToggle />
      </div>
      <div className="grid-item-container" key="maps">
        <DynamicMap />
      </div>
      <div className="grid-item-container" key="social-links">
        <p>social-links</p>
      </div>
      <div className="grid-item-container" key="project-1">
        <p>project-1</p>
      </div>
      <div className="grid-item-container" key="project-2">
        <p>project-2</p>
      </div>
      <div className="grid-item-container" key="project-3">
        <p>project-3</p>
      </div>
    </ResponsiveGridLayout>
  );
}
