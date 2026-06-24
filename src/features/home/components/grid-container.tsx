"use client";

import { type SetLayoutsOptions } from "@/features/home/home-actions";
import { LayoutKey } from "@/lib/site/constants";
import { gridSectionInitialWidth } from "@/lib/site/grid";
import { ReactNode, useSyncExternalStore } from "react";
import { useContainerWidth, type ResponsiveLayouts } from "react-grid-layout";

import GridResponsive from "@/features/home/components/grid-responsive";

function subscribeNoop() {
  return () => {};
}

function readViewportGridWidth(): number {
  return gridSectionInitialWidth(window.innerWidth);
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

export function GridContainer({
  children,
  layouts,
  layoutKey,
  ssrInitialWidth,
  allowedLayoutIds,
  imageSrcs,
}: {
  children: ReactNode;
  layouts: ResponsiveLayouts;
  layoutKey: LayoutKey;
  ssrInitialWidth: number;
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
    () => ssrInitialWidth,
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
