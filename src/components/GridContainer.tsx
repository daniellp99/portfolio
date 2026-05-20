"use client";

import { setLayouts, type SetLayoutsOptions } from "@/lib/actions/set-layouts";
import { LayoutKey } from "@/lib/site/constants";
import {
  GRID_RESPONSIVE_STATIC_PROPS,
  mergeCanonicalBreakpoints,
  syncLayoutsForPersistence,
} from "@/lib/site/grid";
import { ReactNode, startTransition, useOptimistic } from "react";
import {
  getBreakpointFromWidth,
  Layout,
  Responsive,
  ResponsiveLayouts,
  useContainerWidth,
} from "react-grid-layout";

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
  const [optimisticLayouts, addOptimisticLayouts] = useOptimistic(
    layouts,
    (state, newLayouts: ResponsiveLayouts) =>
      mergeCanonicalBreakpoints(state, newLayouts),
  );
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  });
  const changeLayoutAction = (layout: Layout, layouts: ResponsiveLayouts) => {
    const breakpoint = mounted
      ? getBreakpointFromWidth(GRID_RESPONSIVE_STATIC_PROPS.breakpoints, width)
      : "lg";
    const synced = syncLayoutsForPersistence(layout, breakpoint, layouts);
    startTransition(() => {
      addOptimisticLayouts(synced);
      startTransition(async () => {
        await setLayouts(synced, layoutKey, setLayoutsOptions);
      });
    });
  };

  return (
    <div ref={containerRef}>
      {mounted && (
        <Responsive
          dragConfig={{ cancel: ".cancelDrag" }}
          width={width}
          className="layout duration-1000 animate-in fade-in"
          layouts={optimisticLayouts}
          onLayoutChange={changeLayoutAction}
          {...GRID_RESPONSIVE_STATIC_PROPS}
          // isBounded={true}
        >
          {children}
        </Responsive>
      )}
    </div>
  );
}
