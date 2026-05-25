"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";

import {
  buildContributionsMonthSnapshot,
  contributionsMonthCacheTag,
  formatContributionsMonthCookie,
  isCurrentContributionsMonth,
} from "@/lib/contributions/contributions-month";
import { loadOwnerData } from "@/lib/server/content-load";
import {
  CONTRIBUTIONS_MONTH_COOKIE_KEY,
  CONTRIBUTIONS_TZ,
  COOKIE_MAX_AGE,
} from "@/lib/site/constants";

export async function changeContributionsMonth({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<void> {
  const owner = loadOwnerData();
  const login = owner.githubUser.trim();
  if (!login) {
    throw new Error("Missing GitHub username.");
  }

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error("Invalid year or month.");
  }

  const snapshot = buildContributionsMonthSnapshot(
    owner.journeyStartAt,
    undefined,
    CONTRIBUTIONS_TZ,
    { year, month },
  );
  if (!snapshot.years.includes(year)) {
    throw new Error("Year is outside the contributions calendar range.");
  }

  if (isCurrentContributionsMonth(year, month, CONTRIBUTIONS_TZ)) {
    updateTag(contributionsMonthCacheTag(login, year, month, CONTRIBUTIONS_TZ));
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);

  const cookieStore = await cookies();
  cookieStore.set(
    CONTRIBUTIONS_MONTH_COOKIE_KEY,
    formatContributionsMonthCookie({ year, month }),
    { expires, path: "/", sameSite: "lax" },
  );
}
