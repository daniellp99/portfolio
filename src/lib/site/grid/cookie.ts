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
  MAIN_GRID_PROJECT_SLOT_COUNT,
  type LogicalLayoutBreakpoint,
} from "./config";
import { BASE_ITEM_ORDER } from "./defaults";

/** Options for compacting, expanding, and saving layout cookies. */
export type LayoutPersistenceOptions = {
  allowedLayoutIds?: readonly string[];
  imageSrcs?: readonly string[];
};

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

function cloneLayoutItem(item: LayoutItem): LayoutItem {
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

function cloneLayout(layout: Layout): Layout {
  const len = layout.length;
  const out: LayoutItem[] = new Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = cloneLayoutItem(layout[i]!);
  }
  return out;
}

/** Independent lg/md or xs/xxs copies in one pass over items. */
function cloneLayoutAliasPair(layout: Layout): [Layout, Layout] {
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

    out[w++] = {
      i: id,
      x: roundCoord(item.x),
      y: roundCoord(item.y),
      w: roundCoord(item.w),
      h: roundCoord(item.h),
    };
  }
  out.length = w;
  return out;
}

function remapLayoutIndexIds(
  layout: Layout,
  imageSrcs: readonly string[],
): Layout {
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
): [Layout, Layout] {
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
): Layout {
  return imageSrcs === undefined
    ? layout
    : remapLayoutIndexIds(layout, imageSrcs);
}

function assignAliasPair(
  out: ResponsiveLayouts,
  pair: [Layout, Layout],
  keys: readonly ["lg", "md"] | readonly ["xs", "xxs"],
): void {
  out[keys[0]] = pair[0];
  out[keys[1]] = pair[1];
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

    out.sm = expandSingleBreakpoint(layout, imageSrcs);
  }

  return out;
}

export function cookieValueWithinLimit(
  cookieName: string,
  value: string,
): boolean {
  return cookieName.length + value.length <= COOKIE_VALUE_MAX_LENGTH;
}

/** IDs persisted for the main grid cookie (base widgets + up to 3 projects). */
export function mainGridAllowedLayoutIds(
  projectSlugs: readonly string[],
): readonly string[] {
  const projectCount = Math.min(
    projectSlugs.length,
    MAIN_GRID_PROJECT_SLOT_COUNT,
  );
  const out = new Array<string>(BASE_ITEM_ORDER.length + projectCount);
  for (let i = 0; i < BASE_ITEM_ORDER.length; i++) {
    out[i] = BASE_ITEM_ORDER[i]!;
  }
  for (let i = 0; i < projectCount; i++) {
    out[BASE_ITEM_ORDER.length + i] = projectSlugs[i]!;
  }
  return out;
}

export function imageSrcsFromImages<T extends { src: string }>(
  images: readonly T[],
): string[] {
  const len = images.length;
  const out = new Array<string>(len);
  for (let i = 0; i < len; i++) {
    out[i] = images[i]!.src;
  }
  return out;
}

/** Overlay canonical breakpoint layouts onto a base object (client optimistic updates). */
export function mergeCanonicalBreakpoints(
  base: ResponsiveLayouts,
  patch: ResponsiveLayouts,
): ResponsiveLayouts {
  const next: ResponsiveLayouts = { ...base };
  for (let i = 0; i < CANONICAL_LAYOUT_BREAKPOINT_KEYS.length; i++) {
    const key = CANONICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    const value = patch[key];
    if (value !== undefined) next[key] = value;
  }
  return next;
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

  merged[currentBreakpoint] = canonical;
  if (currentBreakpoint === "lg" || currentBreakpoint === "md") {
    merged.lg = canonical;
    merged.md = canonical;
  } else if (currentBreakpoint === "xs" || currentBreakpoint === "xxs") {
    merged.xs = canonical;
    merged.xxs = canonical;
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

/**
 * Cookie read path: one pass over canonical keys (use cookie or fill from defaults).
 * Expanded layouts from `expandFromCookie` are reused without a second clone.
 */
export function normalizeLayoutsFromCookie(
  decoded: ResponsiveLayouts,
  defaults: ResponsiveLayouts,
): ResponsiveLayouts {
  const out: ResponsiveLayouts = {};
  for (let i = 0; i < CANONICAL_LAYOUT_BREAKPOINT_KEYS.length; i++) {
    const key = CANONICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    const fromCookie = decoded[key];
    if (fromCookie !== undefined) {
      out[key] = fromCookie;
      continue;
    }
    const fallback = defaults[key];
    if (fallback !== undefined) {
      out[key] = cloneLayout(fallback);
    }
  }
  return out;
}
