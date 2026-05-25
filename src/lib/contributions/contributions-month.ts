import { formatISO, getMonth, getYear, startOfMonth } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import {
  contributionsMonthCookieSchema,
  type ContributionsYearMonth,
} from "@/lib/schemas/contributions-month";

import {
  CONTRIBUTIONS_MONTH_COOKIE_KEY,
  CONTRIBUTIONS_TZ,
} from "@/lib/site/constants";
import { getMonthStartInZone } from "./calendar-projection";

export type { ContributionsYearMonth } from "@/lib/schemas/contributions-month";

export function formatContributionsMonthCookie({
  month,
  year,
}: ContributionsYearMonth): string {
  return `${String(month).padStart(2, "0")}-${year}`;
}

export function getContributionsYearMonthFromCookies(
  cookieStore: Pick<ReadonlyRequestCookies, "get">,
  timeZone: string = CONTRIBUTIONS_TZ,
  now: Date = new Date(),
): ContributionsYearMonth {
  const raw = cookieStore.get(CONTRIBUTIONS_MONTH_COOKIE_KEY)?.value;
  const parsed = contributionsMonthCookieSchema.safeParse(raw);
  if (parsed.success) {
    return parsed.data;
  }
  return contributionsYearMonthFromDate(
    getCurrentContributionsMonthInZone(now, timeZone),
  );
}

export type ContributionsMonthSnapshot = {
  initialMonthIso: string;
  initialYear: number;
  initialMonthNumber: number;
  calendarStartMonthIso: string;
  calendarEndMonthIso: string;
  years: number[];
  defaultYear: number;
};

function getCurrentContributionsMonthInZone(
  now: Date = new Date(),
  timeZone: string = CONTRIBUTIONS_TZ,
): Date {
  return startOfMonth(toZonedTime(now, timeZone));
}

export function contributionsYearMonthFromDate(date: Date): {
  year: number;
  month: number;
} {
  return { year: getYear(date), month: getMonth(date) + 1 };
}

export function contributionsYearMonthFromDateInZone(
  date: Date,
  timeZone: string = CONTRIBUTIONS_TZ,
): ContributionsYearMonth {
  return {
    year: Number(formatInTimeZone(date, timeZone, "yyyy")),
    month: Number(formatInTimeZone(date, timeZone, "M")),
  };
}

export function normalizeContributionsMonth(
  date: Date,
  timeZone: string = CONTRIBUTIONS_TZ,
): Date {
  return startOfMonth(toZonedTime(date, timeZone));
}

export function buildContributionsMonthSnapshot(
  journeyStartAtIso: string,
  now: Date = new Date(),
  timeZone: string = CONTRIBUTIONS_TZ,
  initialYearMonth?: ContributionsYearMonth,
): ContributionsMonthSnapshot {
  const initialMonth = initialYearMonth
    ? getMonthStartInZone(
        initialYearMonth.year,
        initialYearMonth.month,
        timeZone,
      )
    : getCurrentContributionsMonthInZone(now, timeZone);
  const { year: initialYear, month: initialMonthNumber } =
    initialYearMonth ?? contributionsYearMonthFromDate(initialMonth);

  const startYear = new Date(journeyStartAtIso).getUTCFullYear();
  const currentYear = getYear(toZonedTime(now, timeZone));
  const years: number[] = [];
  for (let y = currentYear; y >= startYear; y -= 1) years.push(y);

  const minYear = years[years.length - 1] ?? currentYear;
  const maxYear = years[0] ?? currentYear;
  const calendarStartMonth = toZonedTime(
    new Date(Date.UTC(minYear, 0, 1)),
    timeZone,
  );
  const calendarEndMonth = toZonedTime(
    new Date(Date.UTC(maxYear, 11, 1)),
    timeZone,
  );

  return {
    initialMonthIso: formatISO(initialMonth),
    initialYear,
    initialMonthNumber,
    calendarStartMonthIso: formatISO(calendarStartMonth),
    calendarEndMonthIso: formatISO(calendarEndMonth),
    years,
    defaultYear: currentYear,
  };
}

export function parseContributionsMonthSnapshot(
  snapshot: ContributionsMonthSnapshot,
): {
  initialMonth: Date;
  calendarStartMonth: Date;
  calendarEndMonth: Date;
} {
  return {
    initialMonth: new Date(snapshot.initialMonthIso),
    calendarStartMonth: new Date(snapshot.calendarStartMonthIso),
    calendarEndMonth: new Date(snapshot.calendarEndMonthIso),
  };
}

export function isCurrentContributionsMonth(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
  now: Date = new Date(),
): boolean {
  const current = contributionsYearMonthFromDate(
    getCurrentContributionsMonthInZone(now, timeZone),
  );
  return current.year === year && current.month === month;
}

export function contributionsMonthCacheTag(
  login: string,
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
): string {
  return `github_contrib_${login}_${year}_${month}_${timeZone}`;
}

/** Stable React key for month-scoped contribution UI (not the Next cache tag). */
export function contributionsMonthCacheKey(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
): string {
  return `${year}-${month}-${timeZone}`;
}
