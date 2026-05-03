"use client";

import { setLayouts } from "@/lib/actions/set-layouts";
import { LayoutKey } from "@/lib/site/constants";
import { GRID_RESPONSIVE_STATIC_PROPS } from "@/lib/site/grid";
import { ReactNode, startTransition, useOptimistic } from "react";
import {
  Layout,
  Responsive,
  ResponsiveLayouts,
  useContainerWidth,
} from "react-grid-layout";

export default function GridContainer({
  children,
  layouts,
  layoutKey,
}: {
  children: ReactNode;
  layouts: ResponsiveLayouts;
  layoutKey: LayoutKey;
}) {
  const [optimisticLayouts, addOptimisticLayouts] = useOptimistic(
    layouts,
    (state, newLayouts) => ({ ...state, ...(newLayouts as ResponsiveLayouts) }),
  );
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  });

  const changeLayoutAction = (layout: Layout, layouts: ResponsiveLayouts) => {
    startTransition(() => {
      addOptimisticLayouts(layouts);
      startTransition(async () => {
        await setLayouts(layouts, layoutKey);
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
