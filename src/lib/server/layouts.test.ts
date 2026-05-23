import { describe, expect, it } from "bun:test";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { ResponsiveLayouts } from "react-grid-layout";

import { getLayouts } from "@/lib/server/layouts";
import {
  ACTIVE_TAB_KEY,
  mainLayoutsKeyForTab,
  MAIN_LAYOUTS_KEY,
} from "@/lib/site/constants";
import { compactForCookie } from "@/lib/site/grid";

function cookieStore(values: Record<string, string>): ReadonlyRequestCookies {
  return {
    get: (key: string) =>
      values[key] === undefined ? undefined : { value: values[key] },
  } as ReadonlyRequestCookies;
}

function encodedMainLayout(x: number): string {
  const layouts: ResponsiveLayouts = {
    lg: [{ i: "me", x, y: 0, w: 1, h: 1 }],
    sm: [{ i: "me", x, y: 0, w: 1, h: 1 }],
    xs: [{ i: "me", x, y: 0, w: 1, h: 1 }],
  };
  return compactForCookie(layouts);
}

describe("getLayouts", () => {
  it("reads main layouts from the active tab-specific cookie", async () => {
    const layouts = await getLayouts(
      { layoutKey: MAIN_LAYOUTS_KEY },
      cookieStore({
        [ACTIVE_TAB_KEY]: "About",
        [MAIN_LAYOUTS_KEY]: encodedMainLayout(1),
        [mainLayoutsKeyForTab("About")]: encodedMainLayout(7),
      }),
    );

    expect(layouts.lg?.[0]?.x).toBe(7);
  });

  it("keeps legacy All-tab main layout cookies readable", async () => {
    const layouts = await getLayouts(
      { layoutKey: MAIN_LAYOUTS_KEY },
      cookieStore({
        [ACTIVE_TAB_KEY]: "All",
        [MAIN_LAYOUTS_KEY]: encodedMainLayout(3),
      }),
    );

    expect(layouts.lg?.[0]?.x).toBe(3);
  });
});
