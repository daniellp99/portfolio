"use client";

import { type SetLayoutsOptions } from "@/features/home/home-actions";
import { LayoutKey } from "@/lib/site/constants";
import { gridSectionInitialWidth } from "@/lib/site/grid";
import {
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ResponsiveLayouts } from "react-grid-layout";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initialWidth);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const next = Math.round(node.getBoundingClientRect().width);
      if (next > 0) {
        setWidth((prev) => (prev === next ? prev : next));
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-full">
      <GridResponsive
        layouts={layouts}
        layoutKey={layoutKey}
        width={width}
        interactive
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
      key={initialWidth}
      layouts={layouts}
      layoutKey={layoutKey}
      initialWidth={initialWidth}
      setLayoutsOptions={setLayoutsOptions}
    >
      {children}
    </GridContainerLayout>
  );
}
