"use client";

import { setLayouts, type SetLayoutsOptions } from "@/lib/actions/set-layouts";
import { LayoutKey } from "@/lib/site/constants";
import {
  GRID_RESPONSIVE_STATIC_PROPS,
  mergeCanonicalBreakpoints,
  syncLayoutsForPersistence,
} from "@/lib/site/grid";
import { startTransition, useOptimistic, type ReactNode } from "react";
import {
  getBreakpointFromWidth,
  Layout,
  Responsive,
  ResponsiveLayouts,
} from "react-grid-layout";

export default function GridResponsive({
  children,
  layouts,
  layoutKey,
  width,
  setLayoutsOptions,
}: {
  children: ReactNode;
  layouts: ResponsiveLayouts;
  layoutKey: LayoutKey;
  width: number;
  setLayoutsOptions: SetLayoutsOptions;
}) {
  const [optimisticLayouts, addOptimisticLayouts] = useOptimistic(
    layouts,
    (state, newLayouts: ResponsiveLayouts) =>
      mergeCanonicalBreakpoints(state, newLayouts),
  );

  const changeLayoutAction = (
    layout: Layout,
    nextLayouts: ResponsiveLayouts,
  ) => {
    const breakpoint = getBreakpointFromWidth(
      GRID_RESPONSIVE_STATIC_PROPS.breakpoints,
      width,
    );
    const synced = syncLayoutsForPersistence(layout, breakpoint, nextLayouts);
    startTransition(() => {
      addOptimisticLayouts(synced);
      startTransition(async () => {
        await setLayouts(synced, layoutKey, setLayoutsOptions);
      });
    });
  };

  return (
    <Responsive
      dragConfig={{ cancel: ".cancelDrag" }}
      width={width}
      className="layout duration-1000 animate-in fade-in"
      layouts={optimisticLayouts}
      onLayoutChange={changeLayoutAction}
      {...GRID_RESPONSIVE_STATIC_PROPS}
    >
      {children}
    </Responsive>
  );
}
