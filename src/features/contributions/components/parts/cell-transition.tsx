"use client";

import { ViewTransition, type ReactNode } from "react";

const directionalEnter = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

const directionalExit = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
} as const;

/**
 * Stable ViewTransition around heatmap cells. Do not key-remount this wrapper
 * on month change — that remounts Suspense children and flashes LoadingCells
 * even when the target month promise is warm. Content swaps use `update`
 * with the nav-forward / nav-back transition types from addTransitionType.
 */
export function ContributionsCellTransition({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ViewTransition
      name="contrib-heatmap-cells"
      enter={directionalEnter}
      exit={directionalExit}
      update={directionalEnter}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
