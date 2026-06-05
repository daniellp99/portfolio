export type MapCenter = [number, number];

export const DEFAULT_CENTER: MapCenter = [20.89689, -76.26652];
export const DEFAULT_ZOOM = 4.49;

export const COOKIE_MAX_AGE = 31536000;
export const COOKIE_VALUE_MAX_LENGTH = 4096;

export const ACTIVE_TAB_KEY = "portfolio-active-tab" as const;

export const MAIN_LAYOUTS_KEY = "portfolio-main-layouts" as const;
export const MAIN_GRID_TABPANEL_ID = "main-grid" as const;
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
  return `${IMAGE_LAYOUTS_PREFIX}${safe}${dim}`;
}

export type LayoutKey = typeof MAIN_LAYOUTS_KEY | ImageLayoutsCookieKey;

export const CONTRIBUTIONS_TZ = "UTC" as const;

export const CONTRIBUTIONS_MONTH_COOKIE_KEY =
  "portfolio-contributions-month" as const;

/** Heatmap lives inside `group/card`; calendar/retry set `data-pending` on descendants (not heatmap siblings). */
export const CONTRIBUTIONS_HEATMAP_PEER_PENDING_CLASS =
  "motion-reduce:animate-none group-has-data-[pending=true]/card:animate-pulse peer-has-data-[pending=true]/retry:animate-pulse" as const;
