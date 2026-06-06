import type { Layout, LayoutItem } from "react-grid-layout";

export function cloneLayoutItem(item: LayoutItem): LayoutItem {
  const out: LayoutItem = {
    i: item.i,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
  };
  if (item.minW !== undefined) out.minW = item.minW;
  if (item.maxW !== undefined) out.maxW = item.maxW;
  if (item.minH !== undefined) out.minH = item.minH;
  if (item.maxH !== undefined) out.maxH = item.maxH;
  if (item.isResizable !== undefined) out.isResizable = item.isResizable;
  if (item.resizeHandles !== undefined) {
    out.resizeHandles = [...item.resizeHandles];
  }
  return out;
}

export function cloneLayout(layout: Layout): Layout {
  const len = layout.length;
  const out: LayoutItem[] = new Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = cloneLayoutItem(layout[i]!);
  }
  return out;
}

/** Independent lg/md or xs/xxs copies in one pass over items. */
export function cloneLayoutAliasPair(layout: Layout): [Layout, Layout] {
  const len = layout.length;
  const a: LayoutItem[] = new Array(len);
  const b: LayoutItem[] = new Array(len);
  for (let i = 0; i < len; i++) {
    const item = layout[i]!;
    a[i] = cloneLayoutItem(item);
    b[i] = cloneLayoutItem(item);
  }
  return [a, b];
}

export function withRglBreakpointAliases(layouts: {
  lg: Layout;
  sm: Layout;
  xs: Layout;
}): {
  lg: Layout;
  md: Layout;
  sm: Layout;
  xs: Layout;
  xxs: Layout;
} {
  const { lg, sm, xs } = layouts;
  return { lg, md: lg, sm, xs, xxs: xs };
}
