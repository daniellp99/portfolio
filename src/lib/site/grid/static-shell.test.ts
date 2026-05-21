import { describe, expect, test } from "bun:test";

import { generateLayouts } from "./defaults";
import { buildStaticShellCss } from "./static-shell";

describe("buildStaticShellCss", () => {
  test("emits placement rules for each layout item", () => {
    const layouts = generateLayouts("All", ["dump-fun", "racial-survey"]);
    const css = buildStaticShellCss(layouts);
    expect(css).toContain("[data-grid-shell]");
    expect(css).toContain('[data-grid-item="maps"]');
    expect(css).toContain("grid-column:");
  });
});
