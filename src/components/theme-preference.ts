export type ColorScheme = "light" | "dark";
export type ThemePreference = ColorScheme | "system";

export const COLOR_SCHEME_META_SYSTEM = "light dark" as const;

export function colorSchemeMetaContent(
  theme: string | undefined,
): ColorScheme | typeof COLOR_SCHEME_META_SYSTEM {
  if (theme === "light" || theme === "dark") {
    return theme;
  }
  return COLOR_SCHEME_META_SYSTEM;
}

export function themePreferenceForScheme(
  scheme: ColorScheme,
  system: ColorScheme,
): ThemePreference {
  return scheme === system ? "system" : scheme;
}

export function nextThemePreference(
  resolved: ColorScheme,
  system: ColorScheme,
): ThemePreference {
  const target: ColorScheme = resolved === "dark" ? "light" : "dark";
  return themePreferenceForScheme(target, system);
}
