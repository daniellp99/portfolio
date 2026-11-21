"use client";

import { useLeafletContext } from "@react-leaflet/core";
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import {
  useDeferredValue,
  useState,
  type TransitionEvent,
} from "react";
import { createPortal } from "react-dom";

/** OpenFreeMap Positron / Dark — same lineage as CARTO light/dark, no API key. */
const OPENFREEMAP_STYLES = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
} as const;

type ThemeMode = keyof typeof OPENFREEMAP_STYLES;

const MAPLIBRE_WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";

type MapLibreStyleLayerProps = {
  styleUrl: string;
  active: boolean;
  /** Fires when the inactive host finishes its opacity fade (settle dual → single). */
  onFadeSettled?: () => void;
};

/**
 * Bind MapLibre GL to the portal host. React 19 callback-ref cleanup replaces
 * useRef + useEffect: setup is tied to the node attaching, teardown to detach.
 */
function attachMapLibreLayer(
  host: HTMLDivElement,
  map: LeafletMap,
  styleUrl: string,
) {
  setWorkerUrl(MAPLIBRE_WORKER_URL);
  const layer = maplibreGL({
    style: styleUrl,
    attributionControl: false,
  });
  map.addLayer(layer);

  const mlContainer = layer.getContainer();
  if (mlContainer.parentNode !== host) {
    host.appendChild(mlContainer);
  }

  const observer = new MutationObserver(() => {
    host.style.width = mlContainer.style.width;
    host.style.height = mlContainer.style.height;
    const nextTransform = mlContainer.style.transform;
    if (
      nextTransform &&
      nextTransform !== "translate3d(0px, 0px, 0px)" &&
      nextTransform !== "translate3d(0, 0, 0)"
    ) {
      host.style.transform = nextTransform;
    }
    observer.disconnect();
    mlContainer.style.transform = "translate3d(0px, 0px, 0px)";
    observer.observe(mlContainer, {
      attributes: true,
      attributeFilter: ["style"],
    });
  });

  host.style.width = mlContainer.style.width;
  host.style.height = mlContainer.style.height;
  host.style.transform = mlContainer.style.transform;
  mlContainer.style.transform = "translate3d(0px, 0px, 0px)";
  observer.observe(mlContainer, {
    attributes: true,
    attributeFilter: ["style"],
  });

  return () => {
    observer.disconnect();
    // View Transitions may reparent Leaflet/MapLibre nodes while this
    // cleans up (X-back / soft nav). Avoid removeChild NotFoundError.
    try {
      const pane = map.getPane("tilePane");
      if (
        pane &&
        mlContainer.parentNode &&
        mlContainer.parentNode !== pane
      ) {
        pane.appendChild(mlContainer);
      }
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    } catch {
      /* DOM already detached by the transition */
    }
  };
}

/**
 * MapLibre is imperative (no React host) and paints to WebGL. Browser view-
 * transition snapshots often omit canvas, so the visible dark↔light fade uses
 * the shared `--duration-enter` / `--duration-exit` opacity recipe on a sized
 * React host.
 *
 * Steady state mounts only the active theme’s GL layer. During a theme switch
 * the outgoing layer stays mounted briefly (opacity 0) so the crossfade can
 * run, then unmounts on `transitionend` — avoids keeping two WebGL contexts
 * alive while the map is visible.
 *
 * No React `<ViewTransition enter/exit>` on these hosts: mounting a portal
 * layer under fade-in makes the VT group morph from empty/offscreen geometry
 * (canvas snapshots are unreliable). In-place fade is CSS opacity only;
 * theme updates still run under startTransition + useDeferredValue.
 */
function MapLibreStyleLayer({
  styleUrl,
  active,
  onFadeSettled,
}: MapLibreStyleLayerProps) {
  const context = useLeafletContext();
  const tilePane = context.map.getPane("tilePane") ?? null;
  const map = context.map;

  if (!tilePane) {
    return null;
  }

  return createPortal(
    <div
      ref={(host) => {
        if (!host) return;
        return attachMapLibreLayer(host, map, styleUrl);
      }}
      onTransitionEnd={(event: TransitionEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;
        if (event.propertyName !== "opacity") return;
        if (active) return;
        onFadeSettled?.();
      }}
      className="map-tiles-fade-host pointer-events-none absolute top-0 left-0"
      data-active={active ? "true" : "false"}
      aria-hidden={!active}
    />,
    tilePane,
  );
}

/**
 * Drop a settled outgoing theme layer. Keeps the latest incoming mode so a
 * stale transitionend cannot revive an older theme.
 */
function settleOutgoingLayers(prev: ThemeMode[]): ThemeMode[] {
  if (prev.length < 2) return prev;
  return [prev[prev.length - 1]!];
}

export default function MapTiles() {
  const { resolvedTheme } = useTheme();
  // Theme updates from next-themes are not Transitions; defer so opacity
  // host updates coalesce with the toggle’s startTransition.
  const theme = useDeferredValue(
    resolvedTheme === "dark" ? "dark" : "light",
  ) satisfies ThemeMode;

  // layers[0] may be a short-lived outgoing theme; last entry is always `theme`.
  const [layers, setLayers] = useState<ThemeMode[]>([theme]);
  const current = layers[layers.length - 1] ?? theme;

  // Adjust during render when the deferred theme flips (React docs:
  // “store information from previous renders” — no Effect).
  if (theme !== current) {
    setLayers([current, theme]);
  }

  return (
    <>
      {layers.map((mode) => (
        <MapLibreStyleLayer
          key={mode}
          styleUrl={OPENFREEMAP_STYLES[mode]}
          active={mode === theme}
          onFadeSettled={
            mode !== theme
              ? () => {
                  setLayers(settleOutgoingLayers);
                }
              : undefined
          }
        />
      ))}
    </>
  );
}
