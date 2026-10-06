"use client";

import { formatInTimeZone } from "date-fns-tz";
import { useDeferredValue, type ReactNode } from "react";

import { getMonthStartInZone } from "@/features/contributions/lib/calendar-projection";
import {
  CONTRIBUTIONS_HEATMAP_PEER_PENDING_CLASS,
  CONTRIBUTIONS_PENDING_PULSE_CLASS,
  CONTRIBUTIONS_TZ,
} from "@/lib/site/constants";
import { cn } from "@/lib/utils";

export function ContributionsDescription({
  year,
  month,
  children,
}: {
  year: number;
  month: number;
  children: ReactNode;
}) {
  // Stay on the previous month label until React commits the deferred update
  // alongside count/cells (avoids caption/body disagreement without a skeleton).
  const deferredYear = useDeferredValue(year);
  const deferredMonth = useDeferredValue(month);
  const isStale = deferredYear !== year || deferredMonth !== month;
  const monthStart = getMonthStartInZone(
    deferredYear,
    deferredMonth,
    CONTRIBUTIONS_TZ,
  );

  return (
    <span
      className={cn(
        CONTRIBUTIONS_HEATMAP_PEER_PENDING_CLASS,
        isStale && CONTRIBUTIONS_PENDING_PULSE_CLASS,
      )}
      data-pending={isStale || undefined}
    >
      {children} contributions in{" "}
      <span className="hidden xl:inline">
        {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMMM yyyy")}
      </span>
      <span className="inline xl:hidden">
        {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMM")}
      </span>
    </span>
  );
}
