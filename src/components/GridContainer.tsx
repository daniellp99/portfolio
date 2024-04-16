"use client";

import { ReactNode } from "react";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function GridContainer({
  children,
  layouts,
}: {
  children: ReactNode;
  layouts: Layouts;
}) {
  return (
    <ResponsiveGridLayout
      draggableCancel=".cancelDrag"
      className="layout duration-1000 animate-in fade-in"
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
      {children}
    </ResponsiveGridLayout>
  );
}
