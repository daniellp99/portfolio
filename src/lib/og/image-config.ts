export const ogImageSize = {
  width: 1200,
  height: 630,
} as const;

export const ogImageContentType = "image/png";

export const ogPalette = {
  bg: "#09090b",
  fg: "#fafafa",
  muted: "#a1a1aa",
  accent: "#3f3f46",
} as const;

export function truncateForOg(text: string, maxChars: number): string {
  const t = text.trim();
  if (t.length <= maxChars) {
    return t;
  }
  return `${t.slice(0, maxChars - 1).trimEnd()}…`;
}
