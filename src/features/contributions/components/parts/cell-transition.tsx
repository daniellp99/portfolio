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

export function ContributionsCellTransition({
  monthKey,
  children,
}: {
  monthKey: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition
      key={monthKey}
      enter={directionalEnter}
      exit={directionalExit}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
