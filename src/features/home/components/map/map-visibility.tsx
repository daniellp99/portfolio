"use client";

import {
  createContext,
  use,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type ContentVisibilityAutoStateChangeEvent = Event & {
  skipped: boolean;
};

type GateFlags = {
  skipped: boolean;
  intersecting: boolean;
};

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

const MapVisibilityContext = createContext(true);

export function useMapVisibility(): boolean {
  return use(MapVisibilityContext);
}

export function MapVisibilityHost({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const renderActive = useMapRenderActive(host);

  return (
    <div
      ref={setHost}
      className={className}
      data-map-render={renderActive ? "active" : "paused"}
    >
      <MapVisibilityContext value={renderActive}>
        {children}
      </MapVisibilityContext>
    </div>
  );
}
