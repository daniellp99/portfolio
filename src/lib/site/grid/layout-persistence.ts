import type { ResponsiveLayouts } from "react-grid-layout";

import {
  CANONICAL_LAYOUT_BREAKPOINT_KEYS,
  MAIN_GRID_PROJECT_SLOT_COUNT,
} from "./config";
import { BASE_ITEM_ORDER } from "./defaults";

/** Options for compacting, expanding, and saving layout cookies. */
export type LayoutPersistenceOptions = {
  allowedLayoutIds?: readonly string[];
  imageSrcs?: readonly string[];
};

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
