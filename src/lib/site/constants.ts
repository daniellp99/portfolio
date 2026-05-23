import { LatLngExpression } from "leaflet";

export const DEFAULT_CENTER = [20.89689, -76.26652] satisfies LatLngExpression;
export const DEFAULT_ZOOM = 4.49;

export const COOKIE_MAX_AGE = 31536000;
export const COOKIE_VALUE_MAX_LENGTH = 4096;

export const ACTIVE_TAB_KEY = "portfolio-active-tab" as const;

export const MAIN_LAYOUTS_KEY = "portfolio-main-layouts" as const;
export const IMAGE_LAYOUTS_KEY = "portfolio-image-layouts" as const;

const MAIN_LAYOUTS_PREFIX = "portfolio-main-layouts__" as const;
const IMAGE_LAYOUTS_PREFIX = "portfolio-image-layouts__" as const;
type MainLayoutsCookieKey =
  | typeof MAIN_LAYOUTS_KEY
  | `${typeof MAIN_LAYOUTS_PREFIX}${string}`;
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
  return `${IMAGE_LAYOUTS_PREFIX}${safe}${dim}` as ImageLayoutsCookieKey;
}

export function mainLayoutsKeyForTab(tab: string): MainLayoutsCookieKey {
  const safe = tab.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${MAIN_LAYOUTS_PREFIX}${safe}` as MainLayoutsCookieKey;
}

export function mainLayoutsCookieNamesForTab(
  tab: string,
): readonly MainLayoutsCookieKey[] {
  const tabKey = mainLayoutsKeyForTab(tab);
  return tab === "All" ? [tabKey, MAIN_LAYOUTS_KEY] : [tabKey];
}

export type LayoutKey = MainLayoutsCookieKey | ImageLayoutsCookieKey;

export const CONTRIBUTIONS_TZ = "UTC" as const;

export const CONTRIBUTIONS_MONTH_COOKIE_KEY =
  "portfolio-contributions-month" as const;

/** Heatmap lives inside `group/card`; calendar/retry set `data-pending` on descendants (not heatmap siblings). */
export const CONTRIBUTIONS_HEATMAP_PEER_PENDING_CLASS =
  "motion-reduce:animate-none group-has-data-[pending=true]/card:animate-pulse peer-has-data-[pending=true]/retry:animate-pulse" as const;
