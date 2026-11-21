"use client";

import {
  useCallback,
  useRef,
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

type HostStore = {
  node: HTMLDivElement | null;
  listeners: Set<() => void>;
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

function isRenderActive(host: HTMLElement | null): boolean {
  if (!host || typeof document === "undefined") {
    return true;
  }
  if (document.visibilityState !== "visible") {
    return false;
  }
  const flags = getFlags(host);
  return !flags.skipped && flags.intersecting;
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

function useHostNode(): [
  HTMLDivElement | null,
  (node: HTMLDivElement | null) => void,
] {
  const storeRef = useRef<HostStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = { node: null, listeners: new Set() };
  }
  const store = storeRef.current;

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      store.listeners.add(onStoreChange);
      return () => {
        store.listeners.delete(onStoreChange);
      };
    },
    [store],
  );

  const getSnapshot = useCallback(() => store.node, [store]);
  const getServerSnapshot = useCallback(() => null, []);
  const node = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setHost = useCallback(
    (next: HTMLDivElement | null) => {
      if (store.node === next) {
        return;
      }
      store.node = next;
      for (const listener of store.listeners) {
        listener();
      }
    },
    [store],
  );

  return [node, setHost];
}

/**
 * Unmounts MapLibre when the map card is skipped by content-visibility,
 * far off-screen (IntersectionObserver fallback), or the document tab is
 * hidden — efficient-background-processing without fighting MapCard deferral.
 */
export function MapRenderGate({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [host, setHost] = useHostNode();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!host) {
        return () => {};
      }
      return subscribeMapGate(host, onStoreChange);
    },
    [host],
  );

  const getSnapshot = useCallback(() => isRenderActive(host), [host]);
  const getServerSnapshot = useCallback(() => true, []);

  const renderActive = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <div
      ref={setHost}
      className={cn("map-render-gate size-full", className)}
      data-map-render={renderActive ? "active" : "paused"}
    >
      {renderActive ? children : null}
    </div>
  );
}
