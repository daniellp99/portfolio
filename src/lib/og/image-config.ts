export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;

export const ogImageContentType = "image/png";

/**
 * OG / link-preview palette aligned with the site dark theme. Main surface uses
 * `background` with light text; avatar / cover cards use `foreground` for contrast.
 *
 * Values match `globals.css` dark-theme tokens (oklch → sRGB).
 */
export const ogPalette = {
  /** Main surface — `background` */
  bg: "#09090b",
  /** Primary text — `foreground` */
  fg: "#fafafa",
  /** Muted text on the dark surface */
  muted: "#a1a1aa",
  /** Avatar / cover card — opposite of main surface (`foreground`) */
  surfaceCard: "#fafafa",
} as const;

export function truncateForOg(text: string, maxChars: number): string {
  const t = text.trim();
  if (t.length <= maxChars) {
    return t;
  }
  return `${t.slice(0, maxChars - 1).trimEnd()}…`;
}
