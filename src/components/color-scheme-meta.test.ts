import { describe, expect, it } from "vitest";

import { colorSchemeMetaContent } from "@/components/theme-preference";

describe("colorSchemeMetaContent", () => {
  it("pins light and dark overrides", () => {
    expect(colorSchemeMetaContent("light")).toBe("light");
    expect(colorSchemeMetaContent("dark")).toBe("dark");
  });

  it("uses light dark for system and unknown", () => {
    expect(colorSchemeMetaContent("system")).toBe("light dark");
    expect(colorSchemeMetaContent(undefined)).toBe("light dark");
    expect(colorSchemeMetaContent("weird")).toBe("light dark");
  });
});
