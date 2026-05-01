"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** True when the device likely has hover-capable fine pointer (e.g. desktop mouse). */
export function usePrefersFinePointer() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
