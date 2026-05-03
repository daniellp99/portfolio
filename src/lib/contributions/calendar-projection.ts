import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

import type { GithubContributionCalendar } from "@/lib/schemas/github-contributions";

import { CONTRIBUTIONS_TZ } from "./constants";

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
