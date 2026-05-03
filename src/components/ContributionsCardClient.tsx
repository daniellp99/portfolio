"use client";

import { formatInTimeZone } from "date-fns-tz";
import { Suspense, ViewTransition } from "react";

import { ContributionsErrorBoundary } from "@/components/contributions/ContributionsErrorBoundary";
import { ContributionsErrorFallback } from "@/components/contributions/ContributionsErrorFallback";
import { ContributionsHeatmap } from "@/components/contributions/ContributionsHeatmap";
import { ContributionsHeatmapFallback } from "@/components/contributions/ContributionsHeatmapFallback";
import { useContributionsCardState } from "@/components/contributions/useContributionsCardState";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTRIBUTIONS_TZ } from "@/lib/contributions/constants";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";

export default function ContributionsCardClient({
  login,
  years,
  defaultYear,
}: {
  login: string;
  years: number[];
  defaultYear: number;
}) {
  const {
    optimisticMonth,
    setMonthFrom,
    year,
    monthNumber,
    retry,
    errorBoundaryResetKey,
    calendarStartMonth,
    calendarEndMonth,
  } = useContributionsCardState({ years, defaultYear });

  return (
    <>
      <CardHeader className="px-1 pt-2 xl:px-2">
        <CardTitle className="text-center xl:text-lg">
          GitHub <span className="hidden xl:inline">Contributions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-1 xl:px-2">
        <ContributionsErrorBoundary
          resetKey={errorBoundaryResetKey}
          fallback={({ error, reset }) => (
            <ContributionsErrorFallback
              error={error}
              onRetry={() => {
                reset();
                retry();
              }}
            />
          )}
        >
          <Suspense
            fallback={
              <ViewTransition exit="slide-down">
                <ContributionsHeatmapFallback year={year} month={monthNumber} />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              <ContributionsHeatmap year={year} month={monthNumber} />
            </ViewTransition>
          </Suspense>
        </ContributionsErrorBoundary>
      </CardContent>
      <CardFooter className="items-end justify-between px-2 pb-2">
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
        <Calendar
          captionLayout="label"
          formatters={{
            formatCaption: (date) =>
              formatInTimeZone(date, CONTRIBUTIONS_TZ, "MMM yyyy"),
          }}
          mode="single"
          month={optimisticMonth}
          onMonthChange={setMonthFrom}
          onNextClick={setMonthFrom}
          onPrevClick={setMonthFrom}
          startMonth={calendarStartMonth}
          endMonth={calendarEndMonth}
          classNames={{
            table: "hidden",
            weekdays: "hidden",
            week: "hidden",
            month: "gap-0",
            caption_label: "text-center leading-4",
          }}
          className="cancelDrag rounded-sm bg-input p-1"
        />
      </CardFooter>
    </>
  );
}
