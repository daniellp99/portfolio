import type { LatLngExpression } from "leaflet";

export const DEFAULT_CENTER = [20.89689, -76.26652] satisfies LatLngExpression;
export const MAIN_LAYOUTS_KEY = "portfolio-main-layouts" as const;
/** Discriminator for getLayouts image branch; cookie key is per-slug via imageLayoutsKeyForSlug */
export const IMAGE_LAYOUTS_KEY = "portfolio-image-layouts" as const;

const IMAGE_LAYOUTS_PREFIX = "portfolio-image-layouts__" as const;
type ImageLayoutsCookieKey = `${typeof IMAGE_LAYOUTS_PREFIX}${string}`;

function imageLayoutDimensionHash(
  images: readonly { src: string; width: number; height: number }[],
): string {
  let h = 0;
  const s = images.map((i) => `${i.src}:${i.width}x${i.height}`).join("|");
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

/** Cookie-safe per-project key for image grid layouts (dims invalidate stale cookies). */
export function imageLayoutsKeyForSlug(
  slug: string | undefined | null,
  images?: readonly { src: string; width: number; height: number }[],
): ImageLayoutsCookieKey {
  const srcList = images?.map((i) => i.src);
  let raw =
    typeof slug === "string" && slug.length > 0
      ? slug
      : srcList?.length
        ? [...srcList].sort().join("-")
        : "default";
  if (raw.length > 180) {
    raw = raw.slice(0, 180);
  }
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "_");
  const dim =
    images?.length && images.length > 0
      ? `_${imageLayoutDimensionHash(images)}`
      : "";
  return `${IMAGE_LAYOUTS_PREFIX}${safe}${dim}` as ImageLayoutsCookieKey;
}

export type LayoutKey = typeof MAIN_LAYOUTS_KEY | ImageLayoutsCookieKey;
export const COOKIE_MAX_AGE = 31536000; // 1 year in seconds
export const DEFAULT_ZOOM = 4.49;
