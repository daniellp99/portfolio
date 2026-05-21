"use client";

import dynamic from "next/dynamic";
import { type SetLayoutsOptions } from "@/lib/actions/set-layouts";
import { LayoutKey } from "@/lib/site/constants";
import { ReactNode } from "react";
import type { ResponsiveLayouts } from "react-grid-layout";

import GridStaticShell from "@/components/GridStaticShell";
import { useGridContainerWidth } from "@/hooks/use-grid-container-width";

const GridResponsive = dynamic(() => import("@/components/GridResponsive"), {
  ssr: false,
});

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
  const { width, containerRef, mounted } = useGridContainerWidth();

  return (
    <div ref={containerRef} className="relative">
      {!mounted ? (
        <GridStaticShell layouts={layouts}>{children}</GridStaticShell>
      ) : (
        <GridResponsive
          layouts={layouts}
          layoutKey={layoutKey}
          width={width}
          setLayoutsOptions={setLayoutsOptions}
        >
          {children}
        </GridResponsive>
      )}
    </div>
  );
}
