"use client";

import {
  createElementObject,
  createTileLayerComponent,
  type LayerProps,
} from "@react-leaflet/core";
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { Activity } from "react";

/** OpenFreeMap Positron / Dark — same lineage as CARTO light/dark, no API key. */
const OPENFREEMAP_STYLES = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
} as const;

const MAPLIBRE_WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";

type MapLibreStyleLayerProps = {
  styleUrl: string;
} & LayerProps;

const MapLibreStyleLayer = createTileLayerComponent<
  ReturnType<typeof maplibreGL>,
  MapLibreStyleLayerProps
>(function createMapLibreStyleLayer({ styleUrl }, context) {
  setWorkerUrl(MAPLIBRE_WORKER_URL);
  const layer = maplibreGL({
    style: styleUrl,
    attributionControl: false,
  });
  return createElementObject(layer, context);
});

export default function MapTiles() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <Activity mode={resolvedTheme === "dark" ? "visible" : "hidden"}>
        <MapLibreStyleLayer styleUrl={OPENFREEMAP_STYLES.dark} />
      </Activity>
      <Activity mode={resolvedTheme === "dark" ? "hidden" : "visible"}>
        <MapLibreStyleLayer styleUrl={OPENFREEMAP_STYLES.light} />
      </Activity>
    </>
  );
}
