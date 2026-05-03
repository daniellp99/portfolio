import { describe, expect, it } from "bun:test";

import { brandTitle } from "./brand";

describe("brandTitle", () => {
  it("returns Portfolio when name is empty", () => {
    expect(brandTitle("")).toBe("Portfolio");
    expect(brandTitle(undefined)).toBe("Portfolio");
    expect(brandTitle(null)).toBe("Portfolio");
  });

  it("returns possessive portfolio title when name is set", () => {
    expect(brandTitle("Alex")).toBe("Alex's Portfolio");
  });
});
