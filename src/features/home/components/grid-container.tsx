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

function readViewportGridWidth(): number | null {
  return gridSectionInitialWidth(window.innerWidth);
}

/** Defer RGL on the server so hydration matches; client picks width on first paint after hydrate. */
function readServerGridWidth(): null {
  return null;
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

  if (initialWidth === null) {
    return <div className="relative" />;
  }

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
