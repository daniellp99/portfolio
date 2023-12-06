"use client";

import { Responsive, WidthProvider } from "react-grid-layout";
import ThemeToggle from "./ThemeToggle";

const GRID_ITEMS_CLASSNAMES =
  "w-full h-full border-2 bg-white dark:bg-zinc-900 dark:border-zinc-700 select-none hover:cursor-grab active:cursor-grabbing";

const LAYOUTS = {
  fourColumnsLg: [
    { i: "me", x: 0, y: 0, w: 2, h: 1.645, isResizable: false },
    { i: "toggle-theme", x: 2, y: 0, w: 1, h: 1.645, isResizable: false },
    { i: "social-links", x: 3, y: 0, w: 1, h: 1.645, isResizable: false },
    { i: "project-1", x: 0, y: 1, w: 2, h: 3.29, isResizable: false },
    { i: "project-2", x: 2, y: 1, w: 2, h: 3.29, isResizable: false },
    { i: "project-3", x: 2, y: 1, w: 2, h: 3.29, isResizable: false },
  ],
  fourColumnsSm: [
    { i: "me", x: 0, y: 0, w: 2, h: 1.09, isResizable: false },
    { i: "toggle-theme", x: 2, y: 0, w: 1, h: 1.09, isResizable: false },
    { i: "social-links", x: 3, y: 0, w: 1, h: 1.09, isResizable: false },
    { i: "project-1", x: 0, y: 1, w: 2, h: 2.18, isResizable: false },
    { i: "project-2", x: 2, y: 1, w: 2, h: 2.18, isResizable: false },
    { i: "project-3", x: 2, y: 1, w: 2, h: 2.18, isResizable: false },
  ],
  twoColumns: [
    { i: "me", x: 0, y: 0, w: 2, h: 1, isResizable: false },
    { i: "toggle-theme", x: 1, y: 2, w: 1, h: 1, isResizable: false },
    { i: "social-links", x: 0, y: 3, w: 1, h: 1, isResizable: false },
    { i: "project-1", x: 0, y: 1, w: 1, h: 2, isResizable: false },
    { i: "project-2", x: 1, y: 2, w: 1, h: 2, isResizable: false },
    { i: "project-3", x: 0, y: 4, w: 2, h: 1, isResizable: false },
  ],
};

const ResponsiveGridLayout = WidthProvider(Responsive);

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
      className="layout "
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 4, md: 4, sm: 4, xs: 2, xxs: 2 }}
      rowHeight={164}
      width={1200}
      margin={[15.7, 15.7]}
      // isBounded={true}
    >
      <div className={GRID_ITEMS_CLASSNAMES} key="me">
        <p>Me</p>
      </div>
      <div className={GRID_ITEMS_CLASSNAMES} key="toggle-theme">
        <ThemeToggle />
      </div>
      <div className={GRID_ITEMS_CLASSNAMES} key="social-links">
        <p>social-links</p>
      </div>
      <div className={GRID_ITEMS_CLASSNAMES} key="project-1">
        <p>project-1</p>
      </div>
      <div className={GRID_ITEMS_CLASSNAMES} key="project-2">
        <p>project-2</p>
      </div>
      <div className={GRID_ITEMS_CLASSNAMES} key="project-3">
        <p>project-3</p>
      </div>
    </ResponsiveGridLayout>
  );
}
