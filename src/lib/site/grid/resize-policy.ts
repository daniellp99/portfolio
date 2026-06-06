import type { Layout, LayoutItem, ResponsiveLayouts } from "react-grid-layout";

import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";

import {
  CANONICAL_LAYOUT_BREAKPOINT_KEYS,
  GRID_RESPONSIVE_STATIC_PROPS,
} from "./config";

export const MAP_LAYOUT_ITEM_ID = "maps";

export const ALL_RESIZE_HANDLES = [
  "s",
  "w",
  "e",
  "n",
  "sw",
  "nw",
  "se",
  "ne",
] as const satisfies readonly NonNullable<
  LayoutItem["resizeHandles"]
>[number][];

export type GridResizePolicyMode = "main" | "image";

function layoutKeyToResizePolicyMode(layoutKey: string): GridResizePolicyMode {
  return layoutKey === MAIN_LAYOUTS_KEY ? "main" : "image";
}

function geometryOnly(item: LayoutItem): LayoutItem {
  return {
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  };
}

function clampMapGeometry(item: LayoutItem, cols: number): LayoutItem {
  return {
    ...item,
    w: Math.min(Math.max(item.w, 1), cols),
    h: Math.max(item.h, 1),
  };
}

export function applyResizePolicyToLayoutItem(
  item: LayoutItem,
  mode: GridResizePolicyMode,
  cols: number,
): LayoutItem {
  const base = geometryOnly(item);

  if (mode === "main" && item.i === MAP_LAYOUT_ITEM_ID) {
    const clamped = clampMapGeometry(base, cols);
    return {
      ...clamped,
      isResizable: true,
      resizeHandles: [...ALL_RESIZE_HANDLES],
      minW: 1,
      minH: 1,
    };
  }

  return {
    ...base,
    isResizable: false,
  };
}

export function applyResizePolicyToLayout(
  layout: Layout,
  layoutKey: string,
  cols: number,
): Layout {
  const mode = layoutKeyToResizePolicyMode(layoutKey);
  const len = layout.length;
  const out: LayoutItem[] = new Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = applyResizePolicyToLayoutItem(layout[i]!, mode, cols);
  }
  return out;
}

export function applyResizePolicyToLayouts(
  layouts: ResponsiveLayouts,
  layoutKey: string,
): ResponsiveLayouts {
  const colsMap = GRID_RESPONSIVE_STATIC_PROPS.cols;
  const out: ResponsiveLayouts = {};

  for (let i = 0; i < CANONICAL_LAYOUT_BREAKPOINT_KEYS.length; i++) {
    const key = CANONICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    const layout = layouts[key];
    if (layout === undefined) continue;
    const cols = colsMap[key as keyof typeof colsMap];
    out[key] = applyResizePolicyToLayout(layout, layoutKey, cols);
  }

  return out;
}
