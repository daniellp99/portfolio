"use client";

import { startTransition, useMemo, useOptimistic, type ReactNode } from "react";
import {
  getBreakpointFromWidth,
  Layout,
  Responsive,
  ResponsiveLayouts,
} from "react-grid-layout";

import { capture } from "@/lib/analytics";
import { setLayouts, type SetLayoutsOptions } from "@/lib/actions/set-layouts";
import { LayoutKey } from "@/lib/site/constants";
import {
  applyResizePolicyToLayout,
  applyResizePolicyToLayouts,
  GRID_RESPONSIVE_STATIC_PROPS,
  mergeCanonicalBreakpoints,
  syncLayoutsForPersistence,
} from "@/lib/site/grid";
import { cn } from "@/lib/utils";

export default function GridResponsive({
  children,
  layouts,
  layoutKey,
  width,
  interactive,
  setLayoutsOptions,
}: {
  children: ReactNode;
  layouts: ResponsiveLayouts;
  layoutKey: LayoutKey;
  width: number;
  interactive: boolean;
  setLayoutsOptions: SetLayoutsOptions;
}) {
  const [optimisticLayouts, addOptimisticLayouts] = useOptimistic(
    layouts,
    (state, newLayouts: ResponsiveLayouts) =>
      mergeCanonicalBreakpoints(state, newLayouts),
  );

  const policyLayouts = useMemo(
    () => applyResizePolicyToLayouts(optimisticLayouts, layoutKey),
    [optimisticLayouts, layoutKey],
  );

  const persistUserLayout = (layout: Layout) => {
    if (!interactive) return;

    capture("grid_layout_changed");

    const breakpoint = getBreakpointFromWidth(
      GRID_RESPONSIVE_STATIC_PROPS.breakpoints,
      width,
    );
    const cols =
      GRID_RESPONSIVE_STATIC_PROPS.cols[
        breakpoint as keyof typeof GRID_RESPONSIVE_STATIC_PROPS.cols
      ];
    const policyLayout = applyResizePolicyToLayout(layout, layoutKey, cols);
    const synced = syncLayoutsForPersistence(
      policyLayout,
      breakpoint,
      optimisticLayouts,
    );
    startTransition(() => {
      addOptimisticLayouts(synced);
      startTransition(async () => {
        await setLayouts(synced, layoutKey, setLayoutsOptions);
      });
    });
  };

  return (
    <Responsive
      dragConfig={{ enabled: interactive, cancel: ".cancelDrag" }}
      resizeConfig={{ enabled: interactive }}
      width={width}
      className={cn(
        "layout",
        interactive && "duration-1000 animate-in fade-in",
      )}
      layouts={policyLayouts}
      onDragStop={persistUserLayout}
      onResizeStop={persistUserLayout}
      {...GRID_RESPONSIVE_STATIC_PROPS}
    >
      {children}
    </Responsive>
  );
}
