"use client";

import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

/** OpenFreeMap Positron / Dark — same lineage as CARTO light/dark, no API key. */
const OPENFREEMAP_STYLES = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
} as const;

const MAPLIBRE_WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";

let mapLibreWorkerConfigured = false;

function ensureMapLibreWorker() {
  if (mapLibreWorkerConfigured) return;
  setWorkerUrl(MAPLIBRE_WORKER_URL);
  mapLibreWorkerConfigured = true;
}

export default function MapTiles() {
  const map = useMap();
  const { resolvedTheme } = useTheme();

  const styleUrl =
    resolvedTheme === "dark"
      ? OPENFREEMAP_STYLES.dark
      : OPENFREEMAP_STYLES.light;

  useEffect(() => {
    ensureMapLibreWorker();

    const layer = maplibreGL({
      style: styleUrl,
      attributionControl: false,
    });
    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, styleUrl]);

  return null;
}
