import {
  decodeLayoutParam,
  encodeLayoutParam,
} from "@/lib/schemas/layout-delta";
import { layoutItemSchema, type DecodedLayouts } from "@/lib/schemas/layouts";
import { stripUnknownLayoutBreakpoints } from "@/lib/site/grid";
import type { ResponsiveLayouts } from "react-grid-layout";
import * as z from "zod";

/** Encode compact layout delta for `?layout=` (null omits param). */
export function toLayoutDelta(
  current: DecodedLayouts,
  baseline: DecodedLayouts,
  activeBreakpoint?: string,
): string | null {
  return encodeLayoutParam(current, baseline, activeBreakpoint);
}

/** Decode compact layout delta against tab/page baseline. */
export function fromLayoutDelta(
  encoded: string,
  baseline: DecodedLayouts,
): DecodedLayouts {
  return decodeLayoutParam(encoded, baseline);
}

const layoutItemsSchema = z.array(layoutItemSchema);

/** Strip unknown breakpoints and RGL-only fields before URL param encode. */
export function toDecodedLayouts(layouts: ResponsiveLayouts): DecodedLayouts {
  const filtered = Object.fromEntries(
    Object.entries(layouts)
      .filter(
        (entry): entry is [string, NonNullable<(typeof entry)[1]>] =>
          entry[1] !== undefined,
      )
      .map(([key, value]) => [key, layoutItemsSchema.parse(value)]),
  );
  return stripUnknownLayoutBreakpoints(filtered);
}

export function serializeLayoutsForCompare(layouts: ResponsiveLayouts): string {
  return JSON.stringify(toDecodedLayouts(layouts));
}
