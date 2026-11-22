"use client";

import { ViewTransition, type ReactNode } from "react";

const directionalUpdate = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "auto",
} as const;

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
