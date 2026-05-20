import { LatLngExpression } from "leaflet";

export const DEFAULT_CENTER = [20.89689, -76.26652] satisfies LatLngExpression;
export const DEFAULT_ZOOM = 4.49;
const IMAGE_LAYOUTS_PREFIX = "image-layouts__" as const;
export type ImageLayoutsKey = `${typeof IMAGE_LAYOUTS_PREFIX}${string}`;

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

/** -safe per-project key for image grid layouts (dims invalidate stale s). */
export function imageLayoutsKeyForSlug(
  slug: string | undefined | null,
  images?: readonly { src: string; width: number; height: number }[],
): ImageLayoutsKey {
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
  return `${IMAGE_LAYOUTS_PREFIX}${safe}${dim}` as ImageLayoutsKey;
}

export const MAIN_LAYOUTS_KEY = "main-layouts" as const;
