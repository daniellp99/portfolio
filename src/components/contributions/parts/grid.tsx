import type { ReactNode } from "react";

import { CONTRIBUTIONS_HEATMAP_PEER_PENDING_CLASS } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

export function ContributionsGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 pt-2 md:pt-4 xl:gap-2",
        CONTRIBUTIONS_HEATMAP_PEER_PENDING_CLASS,
        className,
      )}
    >
      {children}
    </div>
  );
}
