import { describe, expect, it } from "bun:test";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { contributionsMonthCookieSchema } from "@/lib/schemas/contributions-month";

import {
  CONTRIBUTIONS_MONTH_COOKIE_KEY,
  CONTRIBUTIONS_TZ,
} from "@/lib/site/constants";
import {
  buildContributionsMonthSnapshot,
  contributionsMonthCacheKey,
  contributionsMonthCacheTag,
  contributionsYearMonthFromDate,
  formatContributionsMonthCookie,
  getContributionsYearMonthFromCookies,
  isCurrentContributionsMonth,
  normalizeContributionsMonth,
  parseContributionsMonthSnapshot,
} from "./contributions-month";

describe("buildContributionsMonthSnapshot", () => {
  const journeyStartAt = "2023-07-10T00:00:00Z";
  const now = new Date("2025-05-15T12:00:00Z");

  it("builds years from journey start through current year", () => {
    const snapshot = buildContributionsMonthSnapshot(journeyStartAt, now);
    expect(snapshot.years).toEqual([2025, 2024, 2023]);
    expect(snapshot.defaultYear).toBe(2025);
  });

  it("sets initial month from zoned now", () => {
    const snapshot = buildContributionsMonthSnapshot(journeyStartAt, now);
    expect(snapshot.initialYear).toBe(2025);
    expect(snapshot.initialMonthNumber).toBe(5);
    expect(snapshot.initialMonthIso).toMatch(/^2025-05-01/);
  });

  it("sets initial month from provided year-month", () => {
    const snapshot = buildContributionsMonthSnapshot(
      journeyStartAt,
      now,
      CONTRIBUTIONS_TZ,
      { year: 2024, month: 3 },
    );
    expect(snapshot.initialYear).toBe(2024);
    expect(snapshot.initialMonthNumber).toBe(3);
    expect(snapshot.initialMonthIso).toMatch(/^2024-03-01/);
    expect(snapshot.defaultYear).toBe(2025);
  });

  it("sets calendar bounds to journey min year Jan and max year Dec", () => {
    const snapshot = buildContributionsMonthSnapshot(journeyStartAt, now);
    const parsed = parseContributionsMonthSnapshot(snapshot);
    expect(parsed.calendarStartMonth.getUTCFullYear()).toBe(2023);
    expect(parsed.calendarStartMonth.getUTCMonth()).toBe(0);
    expect(parsed.calendarEndMonth.getUTCFullYear()).toBe(2025);
    expect(parsed.calendarEndMonth.getUTCMonth()).toBe(11);
  });
});

describe("parseContributionsMonthSnapshot", () => {
  it("round-trips ISO fields to Dates", () => {
    const snapshot = buildContributionsMonthSnapshot(
      "2023-07-10T00:00:00Z",
      new Date("2024-06-01T00:00:00Z"),
    );
    const { initialMonth } = parseContributionsMonthSnapshot(snapshot);
    expect(contributionsYearMonthFromDate(initialMonth)).toEqual({
      year: snapshot.initialYear,
      month: snapshot.initialMonthNumber,
    });
  });
});

describe("normalizeContributionsMonth", () => {
  it("snaps to start of month in CONTRIBUTIONS_TZ", () => {
    const normalized = normalizeContributionsMonth(
      new Date("2024-03-15T18:00:00Z"),
    );
    expect(contributionsYearMonthFromDate(normalized)).toEqual({
      year: 2024,
      month: 3,
    });
  });
});

describe("isCurrentContributionsMonth", () => {
  it("is true for the zoned current month", () => {
    const now = new Date("2025-05-22T00:00:00Z");
    expect(isCurrentContributionsMonth(2025, 5, CONTRIBUTIONS_TZ, now)).toBe(
      true,
    );
  });

  it("is false for past months", () => {
    const now = new Date("2025-05-22T00:00:00Z");
    expect(isCurrentContributionsMonth(2025, 4, CONTRIBUTIONS_TZ, now)).toBe(
      false,
    );
  });
});

describe("contributionsMonthCacheTag", () => {
  it("includes login, year, month, and tz", () => {
    expect(contributionsMonthCacheTag("octocat", 2024, 3)).toBe(
      "github_contrib_octocat_2024_3_UTC",
    );
  });
});

describe("contributionsMonthCacheKey", () => {
  it("includes year, month, and tz", () => {
    expect(contributionsMonthCacheKey(2024, 1)).toBe(
      `2024-1-${CONTRIBUTIONS_TZ}`,
    );
  });
});

describe("contributionsMonthCookieSchema", () => {
  it("parses MM-YYYY into month and year", () => {
    expect(contributionsMonthCookieSchema.parse("02-2026")).toEqual({
      month: 2,
      year: 2026,
    });
  });

  it("rejects invalid month", () => {
    expect(contributionsMonthCookieSchema.safeParse("13-2026").success).toBe(
      false,
    );
  });

  it("rejects malformed values", () => {
    expect(contributionsMonthCookieSchema.safeParse("2-2026").success).toBe(
      false,
    );
    expect(contributionsMonthCookieSchema.safeParse("02/2026").success).toBe(
      false,
    );
  });
});

describe("formatContributionsMonthCookie", () => {
  it("zero-pads month", () => {
    expect(formatContributionsMonthCookie({ month: 2, year: 2026 })).toBe(
      "02-2026",
    );
  });
});

describe("getContributionsYearMonthFromCookies", () => {
  const now = new Date("2025-05-22T00:00:00Z");

  it("reads valid cookie", () => {
    const cookieStore = {
      get: (key: string) =>
        key === CONTRIBUTIONS_MONTH_COOKIE_KEY
          ? { value: "03-2024" }
          : undefined,
    } as ReadonlyRequestCookies;
    expect(
      getContributionsYearMonthFromCookies(cookieStore, CONTRIBUTIONS_TZ, now),
    ).toEqual({ month: 3, year: 2024 });
  });

  it("defaults to zoned current month when cookie is missing", () => {
    const cookieStore = { get: () => undefined } as ReadonlyRequestCookies;
    expect(
      getContributionsYearMonthFromCookies(cookieStore, CONTRIBUTIONS_TZ, now),
    ).toEqual({ month: 5, year: 2025 });
  });

  it("defaults to zoned current month when cookie is invalid", () => {
    const cookieStore = {
      get: (key: string) =>
        key === CONTRIBUTIONS_MONTH_COOKIE_KEY
          ? { value: "not-a-month" }
          : undefined,
    } as ReadonlyRequestCookies;
    expect(
      getContributionsYearMonthFromCookies(cookieStore, CONTRIBUTIONS_TZ, now),
    ).toEqual({ month: 5, year: 2025 });
  });
});
