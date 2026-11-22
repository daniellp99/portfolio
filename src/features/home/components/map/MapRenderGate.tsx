"use client";

import type { ReactNode } from "react";

import { MapVisibilityHost } from "@/features/home/components/map/map-visibility";
import { cn } from "@/lib/utils";

export function MapRenderGate({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <MapVisibilityHost className={cn("map-render-gate size-full", className)}>
      {children}
    </MapVisibilityHost>
  );
}
