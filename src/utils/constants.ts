import { LatLngExpression } from "leaflet";

export const DEFAULT_CENTER = [20.89689, -76.26652] satisfies LatLngExpression;
export const MAIN_LAYOUTS_KEY = "portfolio-main-layouts" as const;
export const IMAGE_LAYOUTS_KEY = "portfolio-image-layouts" as const;
export type LayoutKey = typeof MAIN_LAYOUTS_KEY | typeof IMAGE_LAYOUTS_KEY;
export const COOKIE_MAX_AGE = 31536000; // 1 year in seconds
