import { describe, expect, it } from "bun:test";

import {
  mainLayoutsCookieNamesForTab,
  mainLayoutsKeyForTab,
  MAIN_LAYOUTS_KEY,
} from "@/lib/site/constants";

describe("main layout cookie keys", () => {
  it("uses a separate persistence cookie per tab", () => {
    expect(mainLayoutsKeyForTab("All")).not.toBe(
      mainLayoutsKeyForTab("Projects"),
    );
  });

  it("keeps the legacy main layout cookie as an All-tab fallback", () => {
    expect(mainLayoutsCookieNamesForTab("All")).toEqual([
      mainLayoutsKeyForTab("All"),
      MAIN_LAYOUTS_KEY,
    ]);
  });

  it("does not let non-All tabs read the legacy shared cookie", () => {
    expect(mainLayoutsCookieNamesForTab("About")).toEqual([
      mainLayoutsKeyForTab("About"),
    ]);
  });
});
