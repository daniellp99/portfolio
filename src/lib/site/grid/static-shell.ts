import type { CSSProperties } from "react";
import type { Layout, LayoutItem, ResponsiveLayouts } from "react-grid-layout";

import { GRID_RESPONSIVE_STATIC_PROPS } from "./config";

type BreakpointShell = "lg" | "sm" | "xs";

const SHELL_BREAKPOINTS: {
  key: BreakpointShell;
  layoutKey: keyof ResponsiveLayouts;
  mediaQuery: string;
  cols: number;
}[] = [
  {
    key: "xs",
    layoutKey: "xs",
    mediaQuery: "(max-width: 767px)",
    cols: 2,
  },
  {
    key: "sm",
    layoutKey: "sm",
    mediaQuery: "(min-width: 768px) and (max-width: 1199px)",
    cols: 4,
  },
  {
    key: "lg",
    layoutKey: "lg",
    mediaQuery: "(min-width: 1200px)",
    cols: 4,
  },
];

function layoutForBreakpoint(
  layouts: ResponsiveLayouts,
  layoutKey: keyof ResponsiveLayouts,
): Layout {
  return layouts[layoutKey] ?? layouts.lg ?? [];
}

function itemPlacementRules(item: LayoutItem): string {
  const { rowHeight, margin } = GRID_RESPONSIVE_STATIC_PROPS;
  const [, marginY] = margin.md;
  const rowSpan = Math.max(1, Math.ceil(item.h));
  const minHeight =
    item.h * rowHeight + Math.max(0, Math.ceil(item.h) - 1) * marginY;

  return [
    `grid-column:${item.x + 1} / span ${item.w}`,
    `grid-row:${item.y + 1} / span ${rowSpan}`,
    `min-height:${minHeight}px`,
  ].join(";");
}

export function buildStaticShellCss(layouts: ResponsiveLayouts): string {
  const rules: string[] = [
    `[data-grid-shell]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:164px;gap:15.5px;width:100%}`,
    `@media (min-width:768px){[data-grid-shell]{grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}}`,
  ];

  for (const bp of SHELL_BREAKPOINTS) {
    const layout = layoutForBreakpoint(layouts, bp.layoutKey);
    for (const item of layout) {
      rules.push(
        `@media ${bp.mediaQuery}{[data-grid-shell] [data-grid-item="${item.i}"]{${itemPlacementRules(item)}}}`,
      );
    }
  }

  return rules.join("");
}

export function staticShellContainerClassName(): string {
  return "mx-auto w-full max-w-[375px] p-[15.5px] md:max-w-[800px] md:p-4 xl:max-w-[1200px]";
}

export function staticShellItemProps(itemId: string): {
  "data-grid-item": string;
  style: CSSProperties;
} {
  return {
    "data-grid-item": itemId,
    style: { width: "100%", minWidth: 0 },
  };
}
