import { describe, expect, it } from "bun:test";
import type { ResponsiveLayouts } from "react-grid-layout";

import {
  fillMissingLayoutBreakpoints,
  normalizeLayoutsFromCookie,
  stripUnknownLayoutBreakpoints,
} from "./normalize";

const sampleItem = { i: "a", x: 0, y: 0, w: 1, h: 1 };

describe("stripUnknownLayoutBreakpoints", () => {
  it("removes non-canonical keys", () => {
    const input: ResponsiveLayouts = {
      lg: [sampleItem],
      bogus: [sampleItem],
    };
    const out = stripUnknownLayoutBreakpoints(input);
    expect(out.lg).toBeDefined();
    expect(out.bogus).toBeUndefined();
  });

  it("clones items so output is safe to mutate", () => {
    const input: ResponsiveLayouts = { lg: [sampleItem] };
    const out = stripUnknownLayoutBreakpoints(input);
    expect(out.lg?.[0]).not.toBe(input.lg?.[0]);
  });
});

describe("fillMissingLayoutBreakpoints", () => {
  it("fills missing canonical keys from defaults", () => {
    const defaults: ResponsiveLayouts = {
      lg: [{ i: "lg", x: 0, y: 0, w: 1, h: 1 }],
      md: [{ i: "md", x: 0, y: 0, w: 1, h: 1 }],
      sm: [{ i: "sm", x: 0, y: 0, w: 1, h: 1 }],
      xs: [{ i: "xs", x: 0, y: 0, w: 1, h: 1 }],
      xxs: [{ i: "xxs", x: 0, y: 0, w: 1, h: 1 }],
    };
    const partial: ResponsiveLayouts = {
      lg: [{ i: "only", x: 1, y: 1, w: 1, h: 1 }],
    };
    const out = fillMissingLayoutBreakpoints(partial, defaults);
    expect(out.lg?.[0]?.i).toBe("only");
    expect(out.md?.[0]?.i).toBe("md");
    expect(out.xxs?.[0]?.i).toBe("xxs");
  });
});

describe("normalizeLayoutsFromCookie", () => {
  it("strips unknown keys then fills missing", () => {
    const defaults: ResponsiveLayouts = {
      lg: [{ i: "d-lg", x: 0, y: 0, w: 1, h: 1 }],
      md: [{ i: "d-md", x: 0, y: 0, w: 1, h: 1 }],
      sm: [{ i: "d-sm", x: 0, y: 0, w: 1, h: 1 }],
      xs: [{ i: "d-xs", x: 0, y: 0, w: 1, h: 1 }],
      xxs: [{ i: "d-xxs", x: 0, y: 0, w: 1, h: 1 }],
    };
    const decoded: ResponsiveLayouts = {
      sm: [{ i: "user-sm", x: 2, y: 2, w: 1, h: 1 }],
      extra: [{ i: "x", x: 0, y: 0, w: 1, h: 1 }],
    };
    const out = normalizeLayoutsFromCookie(decoded, defaults);
    expect(out.extra).toBeUndefined();
    expect(out.sm?.[0]?.i).toBe("user-sm");
    expect(out.lg?.[0]?.i).toBe("d-lg");
    expect(out.xxs?.[0]?.i).toBe("d-xxs");
  });
});
