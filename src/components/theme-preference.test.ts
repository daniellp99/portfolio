import { describe, expect, it } from "bun:test";

import {
  nextThemePreference,
  themePreferenceForScheme,
} from "./theme-preference";

describe("themePreferenceForScheme", () => {
  it("pins dark when OS is light", () => {
    expect(themePreferenceForScheme("dark", "light")).toBe("dark");
  });

  it("returns system when picking light while OS is light", () => {
    expect(themePreferenceForScheme("light", "light")).toBe("system");
  });

  it("pins light when OS is dark", () => {
    expect(themePreferenceForScheme("light", "dark")).toBe("light");
  });

  it("returns system when picking dark while OS is dark", () => {
    expect(themePreferenceForScheme("dark", "dark")).toBe("system");
  });

  it("keeps a dark pin expressible when OS later matches (pick light to leave)", () => {
    // Stored dark, OS now dark: selecting light must pin light, not auto-clear.
    expect(themePreferenceForScheme("light", "dark")).toBe("light");
  });
});

describe("nextThemePreference", () => {
  it("from system light, flip stores dark override", () => {
    expect(nextThemePreference("light", "light")).toBe("dark");
  });

  it("from dark override with OS light, flip returns to system", () => {
    expect(nextThemePreference("dark", "light")).toBe("system");
  });

  it("from system dark, flip stores light override", () => {
    expect(nextThemePreference("dark", "dark")).toBe("light");
  });

  it("from light override with OS dark, flip returns to system", () => {
    expect(nextThemePreference("light", "dark")).toBe("system");
  });

  it("from dark override that now matches OS dark, flip pins light", () => {
    expect(nextThemePreference("dark", "dark")).toBe("light");
  });
});
