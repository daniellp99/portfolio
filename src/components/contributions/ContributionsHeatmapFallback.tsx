"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { monthGridCellCount } from "@/lib/contributions/calendar-projection";
import { WEEKDAY_LABELS } from "@/lib/contributions/weekday-labels";
import { CONTRIBUTIONS_HEATMAP_PEER_PENDING_CLASS } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

export function ContributionsHeatmapFallback({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const cellCount = monthGridCellCount(year, month);
  return (
    <div
      className={cn(
        "grid grid-cols-7 place-items-stretch gap-0.5 pt-2 md:pt-4 xl:gap-2",
        CONTRIBUTIONS_HEATMAP_PEER_PENDING_CLASS,
      )}
    >
      {WEEKDAY_LABELS.map(({ short, initial }) => (
        <span
          key={short}
          className="px-0.25 pb-0.5 text-center text-xs/2 text-muted-foreground xl:p-0"
          aria-hidden="true"
        >
          <span className="xl:hidden">{initial}</span>
          <span className="hidden xl:inline">{short}</span>
        </span>
      ))}
      {Array.from({ length: cellCount }).map((_, idx) => (
        <Skeleton key={idx} className="aspect-square rounded" />
      ))}
    </div>
  );
}
