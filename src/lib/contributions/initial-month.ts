import { getMonth, getYear, startOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { CONTRIBUTIONS_TZ } from "./constants";

export function getCurrentContributionsMonthInZone(): Date {
  return startOfMonth(toZonedTime(new Date(), CONTRIBUTIONS_TZ));
}

export function contributionsYearMonthFromDate(date: Date): {
  year: number;
  month: number;
} {
  return { year: getYear(date), month: getMonth(date) + 1 };
}
