import type { DecodedLayouts } from "@/lib/schemas/layouts";
import type { Layout, ResponsiveLayouts } from "react-grid-layout";

import { CANONICAL_LAYOUT_BREAKPOINT_KEYS } from "./config";

const canonicalSet = new Set<string>(CANONICAL_LAYOUT_BREAKPOINT_KEYS);

function cloneLayout(layout: Layout): Layout {
  return layout.map((item) => ({ ...item }));
}

/** Drop breakpoint keys not in the canonical RGL set. */
export function stripUnknownLayoutBreakpoints(
  layouts: ResponsiveLayouts,
): DecodedLayouts {
  const out: DecodedLayouts = {};
  for (const [key, value] of Object.entries(layouts)) {
    if (!canonicalSet.has(key)) continue;
    if (value === undefined) continue;
    out[key] = value.map((item) => ({ ...item }));
  }
  return out;
}

/** For each canonical key missing in `layouts`, copy from `defaults` (cloned). */
export function fillMissingLayoutBreakpoints(
  layouts: ResponsiveLayouts | DecodedLayouts,
  defaults: ResponsiveLayouts,
): ResponsiveLayouts {
  const out: ResponsiveLayouts = { ...layouts };
  for (const key of CANONICAL_LAYOUT_BREAKPOINT_KEYS) {
    if (out[key] !== undefined) continue;
    const fallback = defaults[key];
    if (fallback !== undefined) {
      out[key] = cloneLayout(fallback);
    }
  }
  return out;
}

/** Cookie read path: strip unknown keys, then fill gaps from generated defaults. */
export function normalizeLayoutsFromCookie(
  decoded: ResponsiveLayouts,
  defaults: ResponsiveLayouts,
): ResponsiveLayouts {
  const stripped = stripUnknownLayoutBreakpoints(decoded);
  return fillMissingLayoutBreakpoints(stripped, defaults);
}
