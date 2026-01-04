/**
 * Metadata utility functions for SEO
 */

/**
 * Get the base URL for the site
 * Uses NEXT_PUBLIC_SITE_URL environment variable if available,
 * otherwise falls back to relative URLs
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback for development or when env var is not set
  return "";
}

/**
 * Construct an absolute URL for Open Graph images
 * Social platforms require absolute URLs for images
 */
export function getAbsoluteImageUrl(imagePath: string): string {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    // If no base URL, return the path as-is (Next.js will handle it)
    return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  }
  // Remove leading slash if baseUrl already ends with one or path starts with one
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl.replace(/\/$/, "")}${cleanPath}`;
}

/**
 * Generate a canonical URL for a given path
 */
export function getCanonicalUrl(path: string = ""): string {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return path.startsWith("/") ? path : `/${path}`;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl.replace(/\/$/, "")}${cleanPath}`;
}

/**
 * Get metadataBase URL object for Next.js metadata
 * Always returns a URL object - uses NEXT_PUBLIC_SITE_URL, VERCEL_URL,
 * or falls back to localhost for development
 */
export function getMetadataBase(): URL {
  // Try NEXT_PUBLIC_SITE_URL first (user-configured)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL);
    } catch {
      // Invalid URL, fall through to next option
    }
  }

  // Try VERCEL_URL (automatically set by Vercel)
  if (process.env.VERCEL_URL) {
    try {
      return new URL(`https://${process.env.VERCEL_URL}`);
    } catch {
      // Invalid URL, fall through to next option
    }
  }

  // Fallback to localhost for development
  // Use PORT environment variable if available, otherwise default to 3000
  const port = process.env.PORT || "3000";
  try {
    return new URL(`http://localhost:${port}`);
  } catch {
    // Last resort fallback
    return new URL("http://localhost:3000");
  }
}
