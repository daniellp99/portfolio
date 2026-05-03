import { endOfMonth, startOfMonth } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { CONTRIBUTIONS_TZ } from "./constants";

/**
 * Inclusive UTC instants for GitHub's contributionsCollection `from` / `to`,
 * from wall-clock month bounds in `timeZone`.
 */
export function toIsoDateRangeForMonth(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
): { from: string; to: string } {
  const monthIndex = month - 1;

  const monthWallClock = new Date(year, monthIndex, 1, 0, 0, 0, 0);
  const fromWallClock = startOfMonth(monthWallClock);
  const toWallClock = endOfMonth(monthWallClock);
  toWallClock.setHours(23, 59, 59, 999);

  const from = fromZonedTime(fromWallClock, timeZone).toISOString();
  const to = fromZonedTime(toWallClock, timeZone).toISOString();

  return { from, to };
}
