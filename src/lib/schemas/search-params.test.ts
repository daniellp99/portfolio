import { describe, expect, it } from "bun:test";

import { toDecodedLayouts } from "@/lib/actions/layout-payload";
import {
  getMainSearchParamsParsers,
  loadMainSearchParams,
  tabParser,
} from "@/lib/schemas/search-params";
import { LAYOUT_DELTA_MAX_ENCODED_LENGTH } from "@/lib/schemas/layout-delta";
import { generateLayouts } from "@/lib/site/grid";

const SAMPLE_SLUGS = ["alpha", "beta"] as const;

describe("tabParser", () => {
  it("accepts valid tab values", () => {
    expect(tabParser.parse("Projects")).toBe("Projects");
  });

  it("returns null for invalid tab values", () => {
    expect(tabParser.parse("invalid")).toBeNull();
  });
});

describe("layout search params parser", () => {
  it("roundtrips generated main layouts", () => {
    const { layout: layoutParser } = getMainSearchParamsParsers(
      [...SAMPLE_SLUGS],
      "All",
    );
    const baseline = toDecodedLayouts(
      generateLayouts("All", [...SAMPLE_SLUGS]),
    );

    expect(layoutParser.serialize(baseline)).toBe("");

    const moved = structuredClone(baseline);
    moved.lg![0]!.x = (moved.lg![0]!.x + 1) % 4;
    const wire = layoutParser.serialize(moved);
    expect(wire.length).toBeGreaterThan(0);
    expect(wire.length).toBeLessThanOrEqual(LAYOUT_DELTA_MAX_ENCODED_LENGTH);

    expect(layoutParser.parse(wire)?.lg?.[0]?.x).toBe(moved.lg?.[0]?.x);
  });

  it("returns null for invalid base64url and falls back via loader default", async () => {
    const baseline = toDecodedLayouts(
      generateLayouts("All", [...SAMPLE_SLUGS]),
    );
    const { layout } = await loadMainSearchParams([...SAMPLE_SLUGS])(
      Promise.resolve({
        layout: "not-valid!!!",
      }),
    );

    expect(layout).toEqual(baseline);
  });

  it("loadMainSearchParams decodes layout against tab baseline", async () => {
    const baseline = toDecodedLayouts(
      generateLayouts("Projects", [...SAMPLE_SLUGS]),
    );
    const moved = structuredClone(baseline);
    moved.lg![0]!.x = (moved.lg![0]!.x + 1) % 4;
    const { layout: layoutParser } = getMainSearchParamsParsers(
      [...SAMPLE_SLUGS],
      "Projects",
    );
    const wire = layoutParser.serialize(moved);

    const { tab, layout } = await loadMainSearchParams([...SAMPLE_SLUGS])(
      Promise.resolve({
        tab: "Projects",
        layout: wire,
      }),
    );

    expect(tab).toBe("Projects");
    expect(layout.lg?.[0]?.x).toBe(moved.lg?.[0]?.x);
  });

  it("treats empty layout query as default", () => {
    const { layout: layoutParser } = getMainSearchParamsParsers(
      [...SAMPLE_SLUGS],
      "All",
    );
    expect(layoutParser.parse("")).toBeNull();
  });
});
