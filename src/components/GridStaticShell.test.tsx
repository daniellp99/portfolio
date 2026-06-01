import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import GridStaticShell from "./GridStaticShell";
import { generateLayouts } from "@/lib/site/grid";

describe("GridStaticShell", () => {
  test("renders keyed grid children into server markup", () => {
    const html = renderToStaticMarkup(
      <GridStaticShell layouts={generateLayouts("All", [])}>
        <section key="me">About content</section>
      </GridStaticShell>,
    );

    expect(html).toContain("data-grid-shell");
    expect(html).toContain('data-grid-item="me"');
    expect(html).toContain("About content");
  });
});
