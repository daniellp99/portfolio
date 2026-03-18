import { LatLngExpression } from "leaflet";

export const DEFAULT_CENTER = [20.89689, -76.26652] satisfies LatLngExpression;
export const MAIN_LAYOUTS_KEY = "portfolio-main-layouts" as const;
/** Discriminator for getLayouts image branch; cookie key is per-slug via imageLayoutsKeyForSlug */
export const IMAGE_LAYOUTS_KEY = "portfolio-image-layouts" as const;

const IMAGE_LAYOUTS_PREFIX = "portfolio-image-layouts__" as const;
export type ImageLayoutsCookieKey = `${typeof IMAGE_LAYOUTS_PREFIX}${string}`;

/** Cookie-safe per-project key for image grid layouts */
export function imageLayoutsKeyForSlug(
  slug: string | undefined | null,
  imageSrcs?: readonly string[],
): ImageLayoutsCookieKey {
  let raw =
    typeof slug === "string" && slug.length > 0
      ? slug
      : imageSrcs?.length
        ? [...imageSrcs].sort().join("-")
        : "default";
  if (raw.length > 180) {
    raw = raw.slice(0, 180);
  }
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${IMAGE_LAYOUTS_PREFIX}${safe}` as ImageLayoutsCookieKey;
}

export type LayoutKey = typeof MAIN_LAYOUTS_KEY | ImageLayoutsCookieKey;
export const COOKIE_MAX_AGE = 31536000; // 1 year in seconds
