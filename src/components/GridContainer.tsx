"use client";

import { setLayouts } from "@/server/layouts";
import { LayoutKey } from "@/utils/constants";
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
        </Responsive>
      )}
    </div>
  );
}
