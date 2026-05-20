import { describe, expect, it } from "bun:test";

import { isTabsType, tabs } from "@/lib/site/tabs";

describe("isTabsType", () => {
  it("accepts canonical tab values", () => {
    for (const tab of tabs) {
      expect(isTabsType(tab)).toBe(true);
    }
  });

  it("rejects unknown values", () => {
    expect(isTabsType("")).toBe(false);
    expect(isTabsType("all")).toBe(false);
    expect(isTabsType("Projects ")).toBe(false);
  });
});
