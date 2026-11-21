"use client";

import { useLeafletContext } from "@react-leaflet/core";
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import {
  useDeferredValue,
  useEffect,
  useState,
  useRef,
  ViewTransition,
} from "react";
import { createPortal } from "react-dom";

/** OpenFreeMap Positron / Dark — same lineage as CARTO light/dark, no API key. */
const OPENFREEMAP_STYLES = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
} as const;

type ThemeMode = keyof typeof OPENFREEMAP_STYLES;

const MAPLIBRE_WORKER_URL = "/maplibre/maplibre-gl-worker.mjs";

/** Match `--duration-enter` / `--duration-exit` in globals.css. */
const THEME_CROSSFADE_MS = 210;

type MapLibreStyleLayerProps = {
  styleUrl: string;
  active: boolean;
};

/**
 * MapLibre is imperative (no React host) and paints to WebGL. Browser view-
 * transition snapshots often omit canvas, so the visible dark↔light fade uses
 * the shared `--duration-enter` / `--duration-exit` opacity recipe on a sized
 * React host.
 *
 * Steady state mounts only the active theme’s GL layer. During a theme switch
 * the outgoing layer stays mounted briefly (opacity 0) so the crossfade can
 * run, then unmounts — avoids keeping two WebGL contexts alive while the map
 * is visible.
 *
 * `<ViewTransition enter/exit>` stays on the host for React VT wiring; theme
 * updates are deferred so they run as Transitions.
 */
function MapLibreStyleLayer({ styleUrl, active }: MapLibreStyleLayerProps) {
  const context = useLeafletContext();
  const hostRef = useRef<HTMLDivElement>(null);
  const tilePane = context.map.getPane("tilePane") ?? null;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    setWorkerUrl(MAPLIBRE_WORKER_URL);
    const layer = maplibreGL({
      style: styleUrl,
      attributionControl: false,
    });
    const map = context.map;
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
      // effect cleans up (X-back / soft nav). Avoid removeChild NotFoundError.
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
  }, [context.map, styleUrl]);

  if (!tilePane) {
    return null;
  }

  return createPortal(
    <div
      ref={hostRef}
      className="map-tiles-fade-host pointer-events-none absolute top-0 left-0"
      data-active={active ? "true" : "false"}
      aria-hidden={!active}
    />,
    tilePane,
  );
}

function ThemedMapTiles({
  styleUrl,
  active,
}: {
  styleUrl: string;
  active: boolean;
}) {
  return (
    <ViewTransition enter="fade-in" exit="fade-out" default="none">
      <MapLibreStyleLayer styleUrl={styleUrl} active={active} />
    </ViewTransition>
  );
}

/**
 * Keep at most two theme layers: the active one, plus a short-lived outgoing
 * layer for the opacity crossfade. Settles back to a single GL context.
 */
function useThemeLayerModes(theme: ThemeMode): ThemeMode[] {
  const [layers, setLayers] = useState<ThemeMode[]>([theme]);
  const [trackedTheme, setTrackedTheme] = useState(theme);

  // Adjust during render when the deferred theme flips (React-recommended
  // “store info from previous renders” pattern — avoids sync setState in effect).
  if (theme !== trackedTheme) {
    setTrackedTheme(theme);
    setLayers((prev) => {
      const from = prev[prev.length - 1] ?? theme;
      return from === theme ? [theme] : [from, theme];
    });
  }

  useEffect(() => {
    if (layers.length < 2) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const holdMs = reducedMotion ? 0 : THEME_CROSSFADE_MS;
    const id = window.setTimeout(() => {
      setLayers([theme]);
    }, holdMs);

    return () => {
      window.clearTimeout(id);
    };
  }, [theme, layers]);

  return layers;
}

export default function MapTiles() {
  const { resolvedTheme } = useTheme();
  // Theme updates from next-themes are not Transitions; defer so VT + opacity
  // class updates run in a Transition.
  const theme = useDeferredValue(
    resolvedTheme === "dark" ? "dark" : "light",
  ) satisfies ThemeMode;
  const layers = useThemeLayerModes(theme);

  return (
    <>
      {layers.map((mode) => (
        <ThemedMapTiles
          key={mode}
          styleUrl={OPENFREEMAP_STYLES[mode]}
          active={mode === theme}
        />
      ))}
    </>
  );
}
