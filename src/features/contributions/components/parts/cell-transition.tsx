"use client";

import { ViewTransition, type ReactNode } from "react";

/**
 * Directional `update` when `addTransitionType("nav-forward"|"nav-back")` is
 * set. Untyped updates (Suspense fallback → content) use the browser default
 * cross-fade. `default="none"` keeps unrelated transitions from animating.
 *
 * Per React 19.3: wrap Suspense with update-only VT so cached (non-suspending)
 * children appear without enter/exit, while fallback→content still animates.
 */
const directionalUpdate = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "auto",
} as const;

/**
 * Stable ViewTransition around the heatmap Suspense boundary. Do not
 * key-remount this wrapper on month change — that remounts Suspense and
 * flashes LoadingCells even when the target month thenable is warm.
 */
export function ContributionsCellTransition({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ViewTransition
      name="contrib-heatmap-cells"
      update={directionalUpdate}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
