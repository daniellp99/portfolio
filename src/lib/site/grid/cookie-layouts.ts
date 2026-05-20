import type { Layout, LayoutItem, ResponsiveLayouts } from "react-grid-layout";

import {
  DecodedLayoutsItem,
  jsonToLogicalLayouts,
  LogicalLayouts,
} from "@/lib/schemas/layouts";
import { COOKIE_VALUE_MAX_LENGTH } from "../constants";
import {
  CANONICAL_LAYOUT_BREAKPOINT_KEYS,
  LOGICAL_LAYOUT_BREAKPOINT_KEYS,
  type LogicalLayoutBreakpoint,
} from "./config";
import {
  cloneLayout,
  cloneLayoutAliasPair,
  cloneLayoutItem,
} from "./layout-copy";
import type { LayoutPersistenceOptions } from "./layout-persistence";

export type CompactForCookieOptions = LayoutPersistenceOptions;
export type ExpandFromCookieOptions = Pick<
  LayoutPersistenceOptions,
  "imageSrcs"
>;

const LOGICAL_KEY_COUNT = LOGICAL_LAYOUT_BREAKPOINT_KEYS.length;
const CANONICAL_KEY_COUNT = CANONICAL_LAYOUT_BREAKPOINT_KEYS.length;

function roundCoord(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function logicalLayoutSource(
  layouts: ResponsiveLayouts,
  key: LogicalLayoutBreakpoint,
): Layout | undefined {
  if (key === "lg") return layouts.lg ?? layouts.md;
  if (key === "sm") return layouts.sm;
  return layouts.xs ?? layouts.xxs;
}

function layoutIndexFromId(id: string, max: number): number | null {
  const index = Number(id);
  if (!Number.isInteger(index) || index < 0 || index >= max) return null;
  return index;
}

function isIdAllowed(
  id: string,
  allowedIds: readonly string[] | undefined,
): boolean {
  if (allowedIds === undefined) return true;
  for (let j = 0; j < allowedIds.length; j++) {
    if (allowedIds[j] === id) return true;
  }
  return false;
}

function shouldSkipBreakpointSync(
  key: string,
  currentBreakpoint: string,
): boolean {
  if (key === currentBreakpoint) return true;
  if (currentBreakpoint === "lg" || currentBreakpoint === "md") {
    return key === "lg" || key === "md";
  }
  if (currentBreakpoint === "xs" || currentBreakpoint === "xxs") {
    return key === "xs" || key === "xxs";
  }
  return false;
}

function buildSrcToIndexLookup(
  imageSrcs: readonly string[],
): Record<string, string> {
  const lookup: Record<string, string> = Object.create(null);
  for (let index = 0; index < imageSrcs.length; index++) {
    lookup[imageSrcs[index]!] = String(index);
  }
  return lookup;
}

/** Filter, optional src→index remap, and compact in one pass. */
function encodeLogicalBreakpoint(
  layout: Layout,
  allowedIds: readonly string[] | undefined,
  srcToIndex: Record<string, string> | undefined,
): DecodedLayoutsItem[] {
  const len = layout.length;
  const out: DecodedLayoutsItem[] = new Array(len);
  let w = 0;
  for (let i = 0; i < len; i++) {
    const item = layout[i]!;
    if (!isIdAllowed(item.i, allowedIds)) continue;

    let id = item.i;
    if (srcToIndex !== undefined) {
      const indexId = srcToIndex[id];
      if (indexId === undefined) continue;
      id = indexId;
    }

    const compact: DecodedLayoutsItem = {
      i: id,
      x: roundCoord(item.x),
      y: roundCoord(item.y),
      w: roundCoord(item.w),
      h: roundCoord(item.h),
    };
    if (item.minW !== undefined) compact.minW = roundCoord(item.minW);
    if (item.maxW !== undefined) compact.maxW = roundCoord(item.maxW);
    if (item.minH !== undefined) compact.minH = roundCoord(item.minH);
    if (item.maxH !== undefined) compact.maxH = roundCoord(item.maxH);
    if (item.isResizable === true) compact.isResizable = true;
    out[w++] = compact;
  }
  out.length = w;
  return out;
}

function remapLayoutIndexIds(
  layout: Layout,
  imageSrcs: readonly string[],
): LayoutItem[] {
  const len = layout.length;
  const out: LayoutItem[] = new Array(len);
  let w = 0;
  for (let i = 0; i < len; i++) {
    const item = layout[i]!;
    const index = layoutIndexFromId(item.i, imageSrcs.length);
    if (index === null) continue;
    const copy = cloneLayoutItem(item);
    copy.i = imageSrcs[index]!;
    out[w++] = copy;
  }
  out.length = w;
  return out;
}

function expandAliasBreakpoint(
  layout: Layout,
  imageSrcs: readonly string[] | undefined,
): [LayoutItem[], LayoutItem[]] {
  if (imageSrcs === undefined) {
    return cloneLayoutAliasPair(layout);
  }

  const len = layout.length;
  const a: LayoutItem[] = new Array(len);
  const b: LayoutItem[] = new Array(len);
  let w = 0;
  for (let i = 0; i < len; i++) {
    const item = layout[i]!;
    const index = layoutIndexFromId(item.i, imageSrcs.length);
    if (index === null) continue;
    const copy = cloneLayoutItem(item);
    copy.i = imageSrcs[index]!;
    a[w] = copy;
    b[w] = cloneLayoutItem(copy);
    w++;
  }
  a.length = w;
  b.length = w;
  return [a, b];
}

function expandSingleBreakpoint(
  layout: Layout,
  imageSrcs: readonly string[] | undefined,
): LayoutItem[] {
  return imageSrcs === undefined
    ? (layout as LayoutItem[])
    : remapLayoutIndexIds(layout, imageSrcs);
}

function assignAliasPair(
  out: ResponsiveLayouts,
  pair: [LayoutItem[], LayoutItem[]],
  keys: readonly ["lg", "md"] | readonly ["xs", "xxs"],
): void {
  out[keys[0]] = pair[0] as Layout;
  out[keys[1]] = pair[1] as Layout;
}

function expandLogicalToResponsive(
  logical: LogicalLayouts,
  imageSrcs: readonly string[] | undefined,
): ResponsiveLayouts {
  const out: ResponsiveLayouts = {};

  for (let i = 0; i < LOGICAL_KEY_COUNT; i++) {
    const key = LOGICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    const layout = logical[key];
    if (layout === undefined) continue;

    if (key === "lg") {
      assignAliasPair(out, expandAliasBreakpoint(layout, imageSrcs), [
        "lg",
        "md",
      ]);
      continue;
    }
    if (key === "xs") {
      assignAliasPair(out, expandAliasBreakpoint(layout, imageSrcs), [
        "xs",
        "xxs",
      ]);
      continue;
    }

    out.sm = expandSingleBreakpoint(layout, imageSrcs) as Layout;
  }

  return out;
}

export function cookieValueWithinLimit(
  cookieName: string,
  value: string,
): boolean {
  return cookieName.length + value.length <= COOKIE_VALUE_MAX_LENGTH;
}

/** RGL updates md/xxs on drag; cookies store lg/xs. */
export function collapseAliasBreakpointsToLogical(layouts: ResponsiveLayouts): {
  lg?: Layout;
  sm?: Layout;
  xs?: Layout;
} {
  const out: { lg?: Layout; sm?: Layout; xs?: Layout } = {};
  for (let i = 0; i < LOGICAL_KEY_COUNT; i++) {
    const key = LOGICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    const layout = logicalLayoutSource(layouts, key);
    if (layout !== undefined) out[key] = layout;
  }
  return out;
}

export function syncLayoutsForPersistence(
  currentLayout: Layout,
  currentBreakpoint: string,
  layouts: ResponsiveLayouts,
): ResponsiveLayouts {
  const canonical = cloneLayout(currentLayout);
  const merged: ResponsiveLayouts = {};

  for (let i = 0; i < CANONICAL_KEY_COUNT; i++) {
    const key = CANONICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    if (shouldSkipBreakpointSync(key, currentBreakpoint)) continue;
    const value = layouts[key];
    if (value !== undefined) merged[key] = value;
  }

  merged[currentBreakpoint] = canonical as Layout;
  if (currentBreakpoint === "lg" || currentBreakpoint === "md") {
    merged.lg = canonical as Layout;
    merged.md = canonical as Layout;
  } else if (currentBreakpoint === "xs" || currentBreakpoint === "xxs") {
    merged.xs = canonical as Layout;
    merged.xxs = canonical as Layout;
  }

  return merged;
}

export function compactForCookie(
  layouts: ResponsiveLayouts,
  options: CompactForCookieOptions = {},
): string {
  const allowedIds = options.allowedLayoutIds;
  const srcToIndex =
    options.imageSrcs !== undefined
      ? buildSrcToIndexLookup(options.imageSrcs)
      : undefined;
  const logical: LogicalLayouts = {};

  for (let i = 0; i < LOGICAL_KEY_COUNT; i++) {
    const key = LOGICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    const layout = logicalLayoutSource(layouts, key);
    if (layout === undefined) continue;
    logical[key] = encodeLogicalBreakpoint(layout, allowedIds, srcToIndex);
  }

  return jsonToLogicalLayouts.encode(logical);
}

export function expandFromCookie(
  jsonString: string,
  options: ExpandFromCookieOptions = {},
): ResponsiveLayouts | null {
  const result = jsonToLogicalLayouts.safeDecode(jsonString);
  if (!result.success) return null;
  return expandLogicalToResponsive(result.data, options.imageSrcs);
}
