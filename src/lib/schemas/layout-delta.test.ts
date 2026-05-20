import { describe, expect, it } from "bun:test";

import { toDecodedLayouts } from "@/lib/actions/layout-payload";
import type { DecodedLayouts } from "@/lib/schemas/layouts";
import {
  applyLayoutDelta,
  decodeLayoutParam,
  decodeLayoutParamSafe,
  diffLayouts,
  encodeLayoutParam,
  LAYOUT_DELTA_MAX_ENCODED_LENGTH,
  LayoutDeltaTooLargeError,
  type LayoutDelta,
  packLayoutDelta,
  unpackLayoutDelta,
  withRglAliases,
} from "@/lib/schemas/layout-delta";
import { generateImageLayouts, generateLayouts } from "@/lib/site/grid";

const SAMPLE_SLUGS = ["alpha", "beta", "gamma"] as const;

function moveItem(
  layouts: DecodedLayouts,
  bp: "lg" | "sm" | "xs",
  itemId: string,
  patch: Partial<{ x: number; y: number; w: number; h: number }>,
): DecodedLayouts {
  const next = structuredClone(layouts);
  const item = next[bp]?.find((entry) => entry.i === itemId);
  if (!item) throw new Error(`missing item ${itemId}`);
  Object.assign(item, patch);
  return next;
}

describe("layout delta codec", () => {
  it("returns null encode when layouts match baseline", () => {
    const baseline = toDecodedLayouts(
      generateLayouts("All", [...SAMPLE_SLUGS]),
    );
    expect(encodeLayoutParam(baseline, baseline)).toBeNull();
    expect(diffLayouts(baseline, baseline)).toBeNull();
    expect(packLayoutDelta(null, baseline)).toBeNull();
  });

  it("encodes drag on md breakpoint (mirrors lg)", () => {
    const baseline = toDecodedLayouts(
      generateLayouts("All", [...SAMPLE_SLUGS]),
    );
    const current = structuredClone(baseline);
    current.md = baseline.lg!.map((item) =>
      item.i === "me" ? { ...item, x: item.x + 1 } : { ...item },
    );

    const encoded = encodeLayoutParam(current, baseline, "md");
    expect(encoded).not.toBeNull();
    expect(
      decodeLayoutParam(encoded!, baseline).lg?.find((i) => i.i === "me")?.x,
    ).toBe(baseline.lg!.find((i) => i.i === "me")!.x + 1);
  });

  it("roundtrips a single-field drag on lg", () => {
    const baseline = toDecodedLayouts(
      generateLayouts("All", [...SAMPLE_SLUGS]),
    );
    const current = moveItem(baseline, "lg", "me", { x: 2 });
    const encoded = encodeLayoutParam(current, baseline);

    expect(encoded).not.toBeNull();
    expect(encoded!.length).toBeLessThanOrEqual(
      LAYOUT_DELTA_MAX_ENCODED_LENGTH,
    );

    const decoded = decodeLayoutParam(encoded!, baseline);
    expect(decoded.lg?.find((item) => item.i === "me")?.x).toBe(2);
    expect(decoded.md).toEqual(decoded.lg);
    expect(decoded.xxs).toEqual(decoded.xs);
  });

  it("roundtrips multi-breakpoint edits", () => {
    const baseline = toDecodedLayouts(
      generateLayouts("Projects", [...SAMPLE_SLUGS]),
    );
    let current = moveItem(baseline, "lg", "maps", { x: 1, y: 2 });
    current = moveItem(current, "sm", "skills", { y: 3 });
    current = moveItem(current, "xs", "contributions", { h: 2 });

    const encoded = encodeLayoutParam(current, baseline);
    expect(encoded).not.toBeNull();
    expect(encoded!.length).toBeLessThanOrEqual(
      LAYOUT_DELTA_MAX_ENCODED_LENGTH,
    );

    const decoded = decodeLayoutParam(encoded!, baseline);
    expect(decoded.lg?.find((item) => item.i === "maps")).toMatchObject({
      x: 1,
      y: 2,
    });
    expect(decoded.sm?.find((item) => item.i === "skills")?.y).toBe(3);
    expect(decoded.xs?.find((item) => item.i === "contributions")?.h).toBe(2);
  });

  it("pack and unpack binary delta", () => {
    const baseline = toDecodedLayouts(
      generateLayouts("About", [...SAMPLE_SLUGS]),
    );
    const current = moveItem(baseline, "lg", "toggle-theme", { w: 2, h: 1 });
    const delta = diffLayouts(current, baseline);
    const bytes = packLayoutDelta(delta, baseline);

    expect(bytes).not.toBeNull();
    const restored = applyLayoutDelta(
      unpackLayoutDelta(bytes!, baseline),
      baseline,
    );
    expect(
      restored.lg?.find((item) => item.i === "toggle-theme"),
    ).toMatchObject({
      w: 2,
      h: 1,
    });
  });

  it("withRglAliases mirrors md and xxs", () => {
    const baseline = toDecodedLayouts(
      generateLayouts("All", [...SAMPLE_SLUGS]),
    );
    const logical = {
      lg: baseline.lg!,
      sm: baseline.sm!,
      xs: baseline.xs!,
    };
    const aliased = withRglAliases(logical);
    expect(aliased.md).toEqual(aliased.lg);
    expect(aliased.xxs).toEqual(aliased.xs);
  });

  it("returns null for invalid payloads", () => {
    const baseline = toDecodedLayouts(
      generateLayouts("All", [...SAMPLE_SLUGS]),
    );
    expect(decodeLayoutParamSafe("not-valid!!!", baseline)).toBeNull();
  });

  it("encoded main grid worst-case stays within max length", () => {
    const baseline = toDecodedLayouts(
      generateLayouts("All", ["a", "b", "c", "d", "e"]),
    );
    let current = structuredClone(baseline);
    for (const bp of ["lg", "sm", "xs"] as const) {
      for (const item of current[bp] ?? []) {
        item.x = (item.x + 1) % 4;
        item.y = Math.min(item.y + 1, 15);
      }
    }

    const encoded = encodeLayoutParam(current, baseline);
    expect(encoded).not.toBeNull();
    expect(encoded!.length).toBeLessThanOrEqual(
      LAYOUT_DELTA_MAX_ENCODED_LENGTH,
    );
  });

  it("encoded image grid worst-case xy-only stays within max length", () => {
    const images = Array.from({ length: 12 }, (_, index) => ({
      src: `/img-${index}.png`,
      alt: `Image ${index}`,
      width: 800,
      height: 600,
    }));
    const baseline = toDecodedLayouts(generateImageLayouts(images));
    let current = structuredClone(baseline);
    for (const bp of ["lg", "sm", "xs"] as const) {
      for (const item of current[bp] ?? []) {
        item.x = (item.x + 1) % 4;
        item.y = Math.min(item.y + 1, 15);
      }
    }

    const encoded = encodeLayoutParam(current, baseline);
    expect(encoded).not.toBeNull();
    expect(encoded!.length).toBeLessThanOrEqual(
      LAYOUT_DELTA_MAX_ENCODED_LENGTH,
    );
  });

  it("throws LayoutDeltaTooLargeError when budget is exceeded", () => {
    const baseline = toDecodedLayouts(
      generateLayouts("All", ["a", "b", "c", "d", "e"]),
    );
    const hugeDelta: LayoutDelta = [];
    for (const bp of ["lg", "sm", "xs"] as const) {
      for (let index = 0; index < (baseline[bp]?.length ?? 0); index++) {
        hugeDelta.push({
          bp,
          index,
          fields: { x: 3, y: 8, w: 2, h: 3 },
        });
      }
    }
    expect(() =>
      encodeLayoutParam(applyLayoutDelta(hugeDelta, baseline), baseline),
    ).toThrow(LayoutDeltaTooLargeError);
  });
});
