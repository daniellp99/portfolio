import type { DecodedLayouts } from "@/lib/schemas/layouts";
import type { Layout, ResponsiveLayouts } from "react-grid-layout";

import { CANONICAL_LAYOUT_BREAKPOINT_KEYS } from "./config";
import { cloneLayout } from "./layout-copy";

function cloneBreakpointLayout(layout: Layout): Layout {
  return cloneLayout(layout) as Layout;
}

/** Drop breakpoint keys not in the canonical RGL set. */
export function stripUnknownLayoutBreakpoints(
  layouts: ResponsiveLayouts,
): DecodedLayouts {
  const out: DecodedLayouts = {};
  for (let i = 0; i < CANONICAL_LAYOUT_BREAKPOINT_KEYS.length; i++) {
    const key = CANONICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    const value = layouts[key];
    if (value === undefined) continue;
    out[key] = cloneLayout(value);
  }
  return out;
}

/** For each canonical key missing in `layouts`, copy from `defaults` (cloned). */
export function fillMissingLayoutBreakpoints(
  layouts: ResponsiveLayouts | DecodedLayouts,
  defaults: ResponsiveLayouts,
): ResponsiveLayouts {
  const out: ResponsiveLayouts = {};
  for (let i = 0; i < CANONICAL_LAYOUT_BREAKPOINT_KEYS.length; i++) {
    const key = CANONICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    const existing = layouts[key];
    if (existing !== undefined) {
      out[key] = existing;
      continue;
    }
    const fallback = defaults[key];
    if (fallback !== undefined) {
      out[key] = cloneBreakpointLayout(fallback);
    }
  }
  return out;
}

/**
 * Cookie read path: one pass over canonical keys (strip unknown + fill defaults).
 * When `fromExpand` is true, `decoded` already owns fresh layouts from `expandFromCookie`
 * and is not re-cloned.
 */
export function normalizeLayoutsFromCookie(
  decoded: ResponsiveLayouts,
  defaults: ResponsiveLayouts,
  fromExpand = false,
): ResponsiveLayouts {
  const out: ResponsiveLayouts = {};
  for (let i = 0; i < CANONICAL_LAYOUT_BREAKPOINT_KEYS.length; i++) {
    const key = CANONICAL_LAYOUT_BREAKPOINT_KEYS[i]!;
    const fromCookie = decoded[key];
    if (fromCookie !== undefined) {
      out[key] = fromExpand
        ? fromCookie
        : cloneBreakpointLayout(fromCookie);
      continue;
    }
    const fallback = defaults[key];
    if (fallback !== undefined) {
      out[key] = cloneBreakpointLayout(fallback);
    }
  }
  return out;
}
