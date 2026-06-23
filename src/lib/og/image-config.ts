export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;

export const ogImageContentType = "image/png";

/**
 * OG / link-preview palette: inverted from the site theme so the preview card
 * contrasts with typical dark chat UIs. Surface uses `foreground`, text uses
 * `background`, and media cards use `background` on the light surface.
 *
 * Values match `globals.css` dark-theme tokens (oklch → sRGB).
 */
export const ogPalette = {
  /** Surface card — `foreground` in dark and light theme */
  bg: "#fafafa",
  /** Primary text — `background` in dark and light theme */
  fg: "#09090b",
  /** Muted text on the light surface */
  muted: "#71717a",
  /** Avatar / cover card — opposite of surface (`background`) */
  surfaceCard: "#09090b",
} as const;

export function truncateForOg(text: string, maxChars: number): string {
  const t = text.trim();
  if (t.length <= maxChars) {
    return t;
  }
  return `${t.slice(0, maxChars - 1).trimEnd()}…`;
}
