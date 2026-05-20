import { describe, expect, it } from "bun:test";
import type { ResponsiveLayouts } from "react-grid-layout";

import {
  fromLayoutDelta,
  serializeLayoutsForCompare,
  toDecodedLayouts,
  toLayoutDelta,
} from "@/lib/actions/layout-payload";
import { LAYOUT_DELTA_MAX_ENCODED_LENGTH } from "@/lib/schemas/layout-delta";
import { generateLayouts } from "@/lib/site/grid";

describe("toDecodedLayouts", () => {
  it("encodes RGL-shaped items with extra fields", () => {
    const layouts: ResponsiveLayouts = {
      lg: [
        {
          i: "me",
          x: 1,
          y: 2,
          w: 1,
          h: 1,
          moved: true,
          static: false,
        },
      ],
      bogus: [{ i: "x", x: 0, y: 0, w: 1, h: 1 }],
    };
    const decoded = toDecodedLayouts(layouts);
    expect(decoded.bogus).toBeUndefined();
    expect(decoded.lg?.[0]).toEqual({
      i: "me",
      x: 1,
      y: 2,
      w: 1,
      h: 1,
    });
    const baseline = structuredClone(decoded);
    const encoded = toLayoutDelta(decoded, baseline);
    expect(encoded).toBeNull();
  });

  it("toLayoutDelta and fromLayoutDelta roundtrip a drag", () => {
    const baseline = toDecodedLayouts(generateLayouts("All", ["alpha"]));
    const moved = structuredClone(baseline);
    moved.lg![0]!.x = (moved.lg![0]!.x + 1) % 4;
    const encoded = toLayoutDelta(moved, baseline);
    expect(encoded).not.toBeNull();
    expect(encoded!.length).toBeLessThanOrEqual(
      LAYOUT_DELTA_MAX_ENCODED_LENGTH,
    );
    expect(fromLayoutDelta(encoded!, baseline).lg?.[0]?.x).toBe(
      moved.lg?.[0]?.x,
    );
  });

  it("returning to origin differs from last persisted but matches stale server prop", () => {
    const origin: ResponsiveLayouts = {
      lg: [{ i: "me", x: 0, y: 0, w: 1, h: 1 }],
    };
    const moved: ResponsiveLayouts = {
      lg: [{ i: "me", x: 2, y: 0, w: 1, h: 1 }],
    };
    const originSerialized = serializeLayoutsForCompare(origin);
    const movedSerialized = serializeLayoutsForCompare(moved);
    expect(originSerialized).toBe(serializeLayoutsForCompare(origin));
    expect(originSerialized).not.toBe(movedSerialized);
  });

  it("serializeLayoutsForCompare is stable for equivalent layouts", () => {
    const a: ResponsiveLayouts = {
      lg: [{ i: "a", x: 0, y: 0, w: 1, h: 1, moved: true } as never],
    };
    const b: ResponsiveLayouts = {
      lg: [{ i: "a", x: 0, y: 0, w: 1, h: 1 }],
    };
    expect(serializeLayoutsForCompare(a)).toBe(serializeLayoutsForCompare(b));
  });
});
