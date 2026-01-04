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
 * Returns undefined if no base URL is configured
 */
export function getMetadataBase(): URL | undefined {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return undefined;
  }
  try {
    return new URL(baseUrl);
  } catch {
    return undefined;
  }
}
