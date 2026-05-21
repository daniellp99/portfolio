import type { LatLngExpression } from "leaflet";

/** Tile index for a lat/lng at integer zoom (Web Mercator). */
export function latLngToTile(
  lat: number,
  lng: number,
  zoom: number,
): { z: number; x: number; y: number } {
  const z = Math.max(0, Math.min(20, Math.round(zoom)));
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );
  return { z, x, y };
}

export function parseCenter(center: LatLngExpression): {
  lat: number;
  lng: number;
} {
  if (Array.isArray(center)) {
    return { lat: center[0], lng: center[1] };
  }
  return { lat: center.lat, lng: center.lng };
}

export type CartoBasemapVariant = "dark" | "light";

export function cartoTileUrl(
  variant: CartoBasemapVariant,
  z: number,
  x: number,
  y: number,
): string {
  const style = variant === "dark" ? "dark_all" : "light_all";
  return `https://c.basemaps.cartocdn.com/${style}/${z}/${x}/${y}.png`;
}
