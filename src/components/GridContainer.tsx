"use client";

import { type SetLayoutsOptions } from "@/lib/actions/set-layouts";
import { LayoutKey } from "@/lib/site/constants";
import {
  GRID_SECTION_MAX_WIDTH,
  gridSectionInitialWidth,
} from "@/lib/site/grid";
import { ReactNode, useSyncExternalStore } from "react";
import { useContainerWidth, type ResponsiveLayouts } from "react-grid-layout";

import GridResponsive from "@/components/GridResponsive";

function subscribeNoop() {
  return () => {};
}

function readViewportGridWidth(): number {
  return gridSectionInitialWidth(window.innerWidth);
}

/** Use a deterministic SSR width so grid content is present before hydration. */
function readServerGridWidth(): number {
  return GRID_SECTION_MAX_WIDTH.base;
}

function GridContainerLayout({
  children,
  layouts,
  layoutKey,
  initialWidth,
  setLayoutsOptions,
}: {
  children: ReactNode;
  layouts: ResponsiveLayouts;
  layoutKey: LayoutKey;
  initialWidth: number;
  setLayoutsOptions: SetLayoutsOptions;
}) {
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
  const initialWidth = useSyncExternalStore(
    subscribeNoop,
    readViewportGridWidth,
    readServerGridWidth,
  );

  return (
    <GridContainerLayout
      layouts={layouts}
      layoutKey={layoutKey}
      initialWidth={initialWidth}
      setLayoutsOptions={setLayoutsOptions}
    >
      {children}
    </GridContainerLayout>
  );
}
