"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";

import { getOwnerData } from "@/features/owner/owner-queries";
import {
  buildContributionsMonthSnapshot,
  contributionsMonthCacheTag,
  formatContributionsMonthCookie,
  isCurrentContributionsMonth,
  stepContributionsMonthFormState,
  type ContributionsMonthFormState,
} from "@/features/contributions/lib/contributions-month";
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
  const owner = getOwnerData();
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

export async function changeContributionsMonthFormAction(
  prevState: ContributionsMonthFormState,
  formData: FormData,
): Promise<ContributionsMonthFormState> {
  const intent = formData.get("intent");
  if (intent !== "prev" && intent !== "next") {
    return prevState;
  }

  const owner = getOwnerData();
  const nextState = stepContributionsMonthFormState(
    prevState,
    intent,
    owner.journeyStartAt,
  );
  if (!nextState) {
    return prevState;
  }

  await changeContributionsMonth({
    year: nextState.year,
    month: nextState.month,
  });

  return nextState;
}
