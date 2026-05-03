/**
 * URL helpers for canonical tags, OG, JSON-LD, and Next metadataBase.
 */

/**
 * Public avatar path for OG, icons, and JSON-LD (leading slash, under /public).
 */
export function getOwnerAvatarPath(avatar: string | null | undefined): string {
  const raw = avatar || "/Avatar.webp";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

/**
 * Canonical origin for absolute URLs (canonical tags, OG, JSON-LD).
 * Matches {@link getMetadataBase} resolution so strings stay consistent with Next metadata.
 */
function getBaseUrl(): string {
  return getMetadataBase().origin;
}

/**
 * Construct an absolute URL for Open Graph images
 * Social platforms require absolute URLs for images
 */
export function getAbsoluteImageUrl(imagePath: string): string {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate a canonical URL for a given path
 */
export function getCanonicalUrl(path: string = ""): string {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get metadataBase URL object for Next.js metadata
 * Always returns a URL object - uses NEXT_PUBLIC_SITE_URL, VERCEL_URL,
 * or falls back to localhost for development
 */
export function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL);
    } catch {
      // Invalid URL, fall through to next option
    }
  }

  if (process.env.VERCEL_URL) {
    try {
      return new URL(`https://${process.env.VERCEL_URL}`);
    } catch {
      // Invalid URL, fall through to next option
    }
  }

  const port = process.env.PORT || "3000";
  try {
    return new URL(`http://localhost:${port}`);
  } catch {
    return new URL("http://localhost:3000");
  }
}
