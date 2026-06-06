import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

import type {
  GithubContributionCalendar,
  GithubContributionMonthResponse,
} from "@/lib/schemas/github-contributions";

import { intensityBucket } from "@/lib/contributions/intensity";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";

export type ContributionHeatmapCell = {
  iso: string;
  outside: boolean;
  bucket: 0 | 1 | 2 | 3 | 4;
  label: string;
};

/** month is 1–12 */
export function monthGridCellCount(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
): number {
  const monthIndex = month - 1;
  const monthStart = startOfMonth(
    toZonedTime(new Date(Date.UTC(year, monthIndex, 1)), timeZone),
  );
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd }).length;
}

/** month is 1–12 */
export function getMonthHeatmapGridDates(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
): Date[] {
  const monthIndex = month - 1;
  const monthStart = startOfMonth(
    toZonedTime(new Date(Date.UTC(year, monthIndex, 1)), timeZone),
  );
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export function getMonthStartInZone(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
): Date {
  const monthIndex = month - 1;
  return startOfMonth(
    toZonedTime(new Date(Date.UTC(year, monthIndex, 1)), timeZone),
  );
}

export function contributionCountsByIsoDate(
  calendar: GithubContributionCalendar,
): Map<string, number> {
  const byDate = new Map<string, number>();
  for (const day of calendar.weeks.flatMap((w) => w.contributionDays)) {
    byDate.set(day.date, day.contributionCount);
  }
  return byDate;
}

export function formatContributionDayTooltip(
  isoDate: string,
  count: number,
  timeZone: string = CONTRIBUTIONS_TZ,
): string {
  const day = parseISO(isoDate);
  const formatted = formatInTimeZone(day, timeZone, "MMM d, yyyy");
  return `${count} contribution${count === 1 ? "" : "s"} on ${formatted}`;
}

export function buildContributionHeatmapCells(
  data: GithubContributionMonthResponse,
  timeZone: string = CONTRIBUTIONS_TZ,
): ContributionHeatmapCell[] {
  const { year, month, calendar } = data;
  const byDate = contributionCountsByIsoDate(calendar);
  const monthStart = getMonthStartInZone(year, month, timeZone);
  const dates = getMonthHeatmapGridDates(year, month, timeZone);
  const max = Math.max(...Array.from(byDate.values()), 0);

  return dates.map((d) => {
    const iso = formatInTimeZone(d, timeZone, "yyyy-MM-dd");
    const outside = getMonth(d) !== getMonth(monthStart);
    const count = byDate.get(iso) ?? 0;
    const bucket = (
      outside ? 0 : intensityBucket(count, max)
    ) as ContributionHeatmapCell["bucket"];
    const label = formatContributionDayTooltip(iso, count, timeZone);

    return { iso, outside, bucket, label };
  });
}
