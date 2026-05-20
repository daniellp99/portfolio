import { describe, expect, it } from "bun:test";

import {
  DEFAULT_ACTIVE_TAB,
  parseActiveTab,
  tabsTypeSchema,
} from "./active-tab";
import { TABS } from "@/lib/site/tabs";

describe("tabsTypeSchema", () => {
  it("accepts each tab label", () => {
    expect(tabsTypeSchema.safeParse(TABS.ALL).success).toBe(true);
    expect(tabsTypeSchema.safeParse(TABS.ABOUT).success).toBe(true);
    expect(tabsTypeSchema.safeParse(TABS.PROJECTS).success).toBe(true);
  });

  it("rejects empty, lowercase, and unknown strings", () => {
    expect(tabsTypeSchema.safeParse("").success).toBe(false);
    expect(tabsTypeSchema.safeParse("all").success).toBe(false);
    expect(tabsTypeSchema.safeParse("unknown").success).toBe(false);
  });
});

describe("parseActiveTab", () => {
  it("returns All for undefined and invalid values", () => {
    expect(parseActiveTab(undefined)).toBe(DEFAULT_ACTIVE_TAB);
    expect(parseActiveTab("")).toBe(DEFAULT_ACTIVE_TAB);
    expect(parseActiveTab("all")).toBe(DEFAULT_ACTIVE_TAB);
    expect(parseActiveTab("nope")).toBe(DEFAULT_ACTIVE_TAB);
  });

  it("round-trips valid tab cookie values", () => {
    expect(parseActiveTab(TABS.ABOUT)).toBe(TABS.ABOUT);
    expect(parseActiveTab(TABS.PROJECTS)).toBe(TABS.PROJECTS);
  });
});
