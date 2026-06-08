"use client";

import { formatInTimeZone } from "date-fns-tz";
import type { ReactNode } from "react";

import { useContributionsBoundary } from "@/components/contributions/parts/boundary";
import { getMonthStartInZone } from "@/lib/contributions/calendar-projection";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";

export function ContributionsDescription({
  children,
}: {
  children: ReactNode;
}) {
  const { year, month } = useContributionsBoundary();
  const monthStart = getMonthStartInZone(year, month, CONTRIBUTIONS_TZ);

  return (
    <>
      {children} contributions in{" "}
      <span className="hidden xl:inline">
        {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMMM yyyy")}
      </span>
      <span className="inline xl:hidden">
        {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMM")}
      </span>
    </>
  );
}
