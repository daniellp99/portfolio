"use client";

import {
  Activity,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ContentVisibilityAutoStateChangeEvent = Event & {
  skipped: boolean;
};

type GateFlags = {
  skipped: boolean;
  intersecting: boolean;
};

/** Per-host mutable flags; WeakMap so teardown GC cleans them up. */
const flagsByHost = new WeakMap<HTMLElement, GateFlags>();

function getFlags(host: HTMLElement): GateFlags {
  let flags = flagsByHost.get(host);
  if (!flags) {
    flags = { skipped: false, intersecting: true };
    flagsByHost.set(host, flags);
  }
  return flags;
}

function supportsContentVisibility(): boolean {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("content-visibility", "auto")
  );
}

function subscribeMapGate(host: HTMLElement, onStoreChange: () => void) {
  const flags = getFlags(host);

  const onVisibility = () => {
    onStoreChange();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const onContentVisibility = (event: Event) => {
    const cvEvent = event as ContentVisibilityAutoStateChangeEvent;
    flags.skipped = Boolean(cvEvent.skipped);
    if (!cvEvent.skipped) {
      flags.intersecting = true;
    }
    onStoreChange();
  };
  host.addEventListener(
    "contentvisibilityautostatechange",
    onContentVisibility,
  );

  let observer: IntersectionObserver | undefined;
  if (!supportsContentVisibility()) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        flags.intersecting = entry?.isIntersecting ?? false;
        onStoreChange();
      },
      { rootMargin: "200px", threshold: 0 },
    );
    observer.observe(host);
  }

  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    host.removeEventListener(
      "contentvisibilityautostatechange",
      onContentVisibility,
    );
    observer?.disconnect();
  };
}

function isRenderActive(host: HTMLElement | null): boolean {
  if (!host) {
    return true;
  }
  if (document.visibilityState !== "visible") {
    return false;
  }
  const { skipped, intersecting } = getFlags(host);
  return !skipped && intersecting;
}

function useMapRenderActive(host: HTMLElement | null): boolean {
  // External store (CV / visibility / IO) — not an Effect.
  // Compiler memoizes these closures when `host` is stable.
  return useSyncExternalStore(
    (onStoreChange) => {
      if (!host) {
        return () => {};
      }
      return subscribeMapGate(host, onStoreChange);
    },
    () => isRenderActive(host),
    () => true,
  );
}

/**
 * Pauses MapLibre when the map card is skipped by content-visibility, far
 * off-screen (IntersectionObserver fallback), or the document tab is hidden.
 *
 * Uses `<Activity>` instead of conditional unmount: Effects (GL bind) still
 * tear down while paused, but React state (zoom level, theme settle) is
 * preserved for the next visible pass. No ViewTransition here — remounting
 * the WebGL host under enter/exit morphs from empty/offscreen geometry.
 */
export function MapRenderGate({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  // Callback ref → state: host is available for the external-store subscribe.
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const renderActive = useMapRenderActive(host);

  return (
    <div
      ref={setHost}
      className={cn("map-render-gate size-full", className)}
      data-map-render={renderActive ? "active" : "paused"}
    >
      <Activity mode={renderActive ? "visible" : "hidden"}>{children}</Activity>
    </div>
  );
}
