import { formatInTimeZone } from "date-fns-tz";
import { ArrowUpRightIcon } from "lucide-react";
import { cookies } from "next/headers";
import { Suspense, ViewTransition } from "react";

import { ContributionsCalendar } from "@/components/contributions/ContributionsCalendar";
import { ContributionsCount } from "@/components/contributions/ContributionsCount";
import { ContributionsHeatmap } from "@/components/contributions/ContributionsHeatmap";
import { ContributionsHeatmapFallback } from "@/components/contributions/ContributionsHeatmapFallback";
import { ContributionsLegend } from "@/components/contributions/ContributionsLegend";
import { ContributionsMonthContent } from "@/components/contributions/ContributionsMonthContent";
import { buttonVariants } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMonthStartInZone } from "@/lib/contributions/calendar-projection";
import {
  buildContributionsMonthSnapshot,
  contributionsMonthCacheKey,
  getContributionsYearMonthFromCookies,
  parseContributionsMonthSnapshot,
} from "@/lib/contributions/contributions-month";
import { loadOwnerData } from "@/lib/server/content-load";
import { getGithubContributionsForMonth } from "@/lib/server/github-contributions";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

export default async function ContributionsCard() {
  const cookieStore = await cookies();
  const ownerData = loadOwnerData();
  const login = ownerData.githubUser.trim();

  const { year, month } = getContributionsYearMonthFromCookies(cookieStore);
  const contributionsPromise = getGithubContributionsForMonth(
    login,
    year,
    month,
  );

  if (!login) {
    return (
      <CardHeader className="h-full place-content-center place-items-center justify-evenly">
        <CardTitle>No GitHub Username</CardTitle>
      </CardHeader>
    );
  }

  const snapshot = buildContributionsMonthSnapshot(
    ownerData.journeyStartAt,
    undefined,
    CONTRIBUTIONS_TZ,
    { year, month },
  );
  const { initialMonth, calendarStartMonth, calendarEndMonth } =
    parseContributionsMonthSnapshot(snapshot);
  const monthStart = getMonthStartInZone(year, month);

  return (
    <>
      <CardHeader className="order-1 px-1 pt-2 xl:px-2">
        <CardTitle className="text-center leading-tight xl:text-lg xl:leading-normal">
          GitHub <span className="hidden xl:inline">Contributions</span>
        </CardTitle>
      </CardHeader>
      <CardFooter className="peer/contribution-calendar order-3 items-end justify-between px-2 pb-2">
        <a
          className={cn(
            "cancelDrag",
            buttonVariants({ variant: "projectLink", size: "icon-lg" }),
          )}
          href={`https://github.com/${login}`}
        >
          <ArrowUpRightIcon data-icon="inline-start" className="size-5" />
          <span className="sr-only">Open GitHub profile</span>
        </a>
        <ContributionsCalendar
          initialMonth={initialMonth}
          calendarStartMonth={calendarStartMonth}
          calendarEndMonth={calendarEndMonth}
        />
      </CardFooter>
      <CardContent className="group/contribution-content order-2 flex-1 px-1 xl:px-2">
        <ContributionsMonthContent year={year} month={month}>
          <CardDescription className="text-center text-xs">
            <Suspense fallback={<span>0</span>}>
              <ContributionsCount
                key={contributionsMonthCacheKey(year, month)}
                contributionsPromise={contributionsPromise}
              />
            </Suspense>{" "}
            contributions in{" "}
            <span className="hidden xl:inline">
              {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMMM yyyy")}
            </span>
            <span className="inline xl:hidden">
              {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMM")}
            </span>
          </CardDescription>
          <Suspense
            fallback={
              <ViewTransition exit="slide-down">
                <ContributionsHeatmapFallback year={year} month={month} />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              <ContributionsHeatmap
                contributionsPromise={contributionsPromise}
              />
            </ViewTransition>
          </Suspense>
          <ContributionsLegend />
        </ContributionsMonthContent>
      </CardContent>
    </>
  );
}
