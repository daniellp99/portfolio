"use client";
import { ReactNode, useState } from "react";
import { useContainerWidth, type ResponsiveLayouts } from "react-grid-layout";

import GridResponsive from "@/components/GridResponsive";

import { type SetLayoutsOptions } from "@/lib/actions/set-layouts";
import { LayoutKey } from "@/lib/site/constants";
import { GRID_SECTION_MAX_WIDTH } from "@/lib/site/grid";
import { gridSectionInitialWidth } from "@/lib/site/grid/config";

function readInitialGridWidth(): number {
  if (typeof window === "undefined") {
    return GRID_SECTION_MAX_WIDTH.base;
  }
  return gridSectionInitialWidth(window.innerWidth);
}

export default function GridContainer({
  children,
  layouts,
  layoutKey,
  allowedLayoutIds,
  imageSrcs,
}: {
  children: ReactNode;
  layouts: ResponsiveLayouts;
  layoutKey: LayoutKey;
  allowedLayoutIds?: readonly string[];
  imageSrcs?: readonly string[];
}) {
  const setLayoutsOptions: SetLayoutsOptions =
    allowedLayoutIds !== undefined || imageSrcs !== undefined
      ? { allowedLayoutIds, imageSrcs }
      : {};
  const [initialWidth] = useState(readInitialGridWidth);
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
    initialWidth,
  });

  return (
    <div ref={containerRef} className="relative">
      <GridResponsive
        layouts={layouts}
        layoutKey={layoutKey}
        width={width}
        interactive={mounted}
        setLayoutsOptions={setLayoutsOptions}
      >
        {children}
      </GridResponsive>
    </div>
  );
}
