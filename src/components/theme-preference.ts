export type ColorScheme = "light" | "dark";
export type ThemePreference = ColorScheme | "system";

/** Store system when the chosen scheme matches the OS; otherwise pin the scheme. */
export function themePreferenceForScheme(
  scheme: ColorScheme,
  system: ColorScheme,
): ThemePreference {
  return scheme === system ? "system" : scheme;
}

/** Flip the resolved appearance, then apply Verou storage rules. */
export function nextThemePreference(
  resolved: ColorScheme,
  system: ColorScheme,
): ThemePreference {
  const target: ColorScheme = resolved === "dark" ? "light" : "dark";
  return themePreferenceForScheme(target, system);
}
