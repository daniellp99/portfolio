"use client";
import {
  ReactNode,
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
} from "react";
import {
  Layout,
  Responsive,
  ResponsiveLayouts,
  useContainerWidth,
} from "react-grid-layout";
import { getBreakpointFromWidth } from "react-grid-layout/core";

import { toDecodedLayouts } from "@/lib/actions/layout-payload";
import { useSearchParams } from "@/lib/hooks/use-search-params";
import {
  encodeLayoutParam,
  LayoutDeltaTooLargeError,
} from "@/lib/schemas/layout-delta";
import { setLayoutEncodeBreakpoint } from "@/lib/schemas/search-params";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import {
  generateImageLayouts,
  generateLayouts,
  GRID_RESPONSIVE_STATIC_PROPS,
} from "@/lib/site/grid";
import type { TabsType } from "@/lib/site/tabs";
import type {
  GetImageLayoutsParams,
  GetMainLayoutsParams,
} from "@/types/search-params";

type GridContainerProps = (GetMainLayoutsParams | GetImageLayoutsParams) & {
  children: ReactNode;
  layouts: ResponsiveLayouts;
};

export default function GridContainer({
  children,
  layouts,
  ...params
}: GridContainerProps) {
  const [searchState, setSearchParams] = useSearchParams({
    ...params,
    shallow: false,
    startTransition,
    history: "replace",
  });

  const tab: TabsType =
    params.layoutKey === MAIN_LAYOUTS_KEY
      ? ((searchState as unknown as { tab: TabsType }).tab ?? "All")
      : "All";

  const baseline =
    params.layoutKey === MAIN_LAYOUTS_KEY
      ? toDecodedLayouts(generateLayouts(tab, params.projectSlugs))
      : toDecodedLayouts(generateImageLayouts(params.images));

  const [optimisticLayouts, addOptimisticLayouts] = useOptimistic(
    layouts,
    (state, newLayouts) => ({ ...state, ...(newLayouts as ResponsiveLayouts) }),
  );
  const layoutsRef = useRef(optimisticLayouts);
  useEffect(() => {
    layoutsRef.current = optimisticLayouts;
  }, [optimisticLayouts]);

  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  });

  const persistLayoutToUrl = (nextLayouts: ResponsiveLayouts) => {
    try {
      const activeBreakpoint =
        width > 0
          ? getBreakpointFromWidth(
              GRID_RESPONSIVE_STATIC_PROPS.breakpoints,
              width,
            )
          : undefined;
      const decoded = toDecodedLayouts(nextLayouts);
      encodeLayoutParam(decoded, baseline, activeBreakpoint);
      setLayoutEncodeBreakpoint(activeBreakpoint);
      void setSearchParams({ layout: decoded });
    } catch (error) {
      if (error instanceof LayoutDeltaTooLargeError) {
        return;
      }
      throw error;
    }
  };

  /** RGL also fires this on breakpoint / width changes — UI only, no URL write. */
  const changeLayoutAction = (
    _layout: Layout,
    nextLayouts: ResponsiveLayouts,
  ) => {
    layoutsRef.current = nextLayouts;
    startTransition(() => {
      addOptimisticLayouts(nextLayouts);
    });
  };

  const dragStopAction = (layout: Layout) => {
    const activeBreakpoint =
      width > 0
        ? getBreakpointFromWidth(
            GRID_RESPONSIVE_STATIC_PROPS.breakpoints,
            width,
          )
        : "lg";
    const nextLayouts: ResponsiveLayouts = {
      ...layoutsRef.current,
      [activeBreakpoint]: layout,
    };
    layoutsRef.current = nextLayouts;

    startTransition(() => {
      addOptimisticLayouts(nextLayouts);
      persistLayoutToUrl(nextLayouts);
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
          onDragStop={dragStopAction}
          {...GRID_RESPONSIVE_STATIC_PROPS}
        >
          {children}
        </Responsive>
      )}
    </div>
  );
}
