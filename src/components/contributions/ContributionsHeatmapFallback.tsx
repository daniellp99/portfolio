"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { monthGridCellCount } from "@/lib/contributions/calendar-projection";
import { WEEKDAY_LABELS } from "@/lib/contributions/weekday-labels";

import { ContributionsLegend } from "./ContributionsLegend";

export function ContributionsHeatmapFallback({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const cellCount = monthGridCellCount(year, month);
  return (
    <div className="flex flex-col items-stretch">
      <Skeleton className="h-4 w-full self-center rounded xl:w-3/4" />
      <div className="grid grid-cols-7 place-items-stretch gap-0.5 pt-2 md:pt-4 xl:gap-2">
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
      <ContributionsLegend />
    </div>
  );
}
