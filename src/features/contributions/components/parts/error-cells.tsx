"use client";

import { getMonth } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { AlertTriangleIcon } from "lucide-react";
import { ViewTransition } from "react";

import { useContributionsBoundary } from "@/features/contributions/components/parts/boundary";
import { ContributionsCell } from "@/features/contributions/components/parts/cell";
import { ContributionsCellTransition } from "@/features/contributions/components/parts/cell-transition";
import { Button } from "@/components/ui/button";

import {
  getMonthHeatmapGridDates,
  getMonthStartInZone,
} from "@/features/contributions/lib/calendar-projection";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";

export function ContributionsErrorCells({
  year: yearProp,
  month: monthProp,
  error,
}: {
  year: number;
  month: number;
  error: Error;
}) {
  const { retry, retryPending } = useContributionsBoundary();
  const year = yearProp;
  const month = monthProp;
  const monthKey = `${year}-${month}`;

  const isProd = process.env.NODE_ENV === "production";
  const monthStart = getMonthStartInZone(year, month);
  const dates = getMonthHeatmapGridDates(year, month);

  return (
    <>
      <ContributionsCellTransition monthKey={monthKey}>
        <ol
          aria-hidden="true"
          inert
          className="grid grid-cols-7 place-items-stretch gap-1 [grid-area:cells] xl:gap-2"
        >
          {dates.map((d) => {
            const iso = formatInTimeZone(d, CONTRIBUTIONS_TZ, "yyyy-MM-dd");
            const isOutside = getMonth(d) !== getMonth(monthStart);
            return (
              <ContributionsCell key={iso} state="error" outside={isOutside} />
            );
          })}
        </ol>
      </ContributionsCellTransition>

      <ViewTransition
        name="contributions-error-alert"
        share="contributions-error-fixed"
        default="none"
      >
        <div
          role="alert"
          aria-live="polite"
          className="grid h-fit place-items-center gap-1 place-self-center rounded p-1 [grid-area:cells]"
        >
          <AlertTriangleIcon
            aria-hidden="true"
            className="size-4 text-destructive sm:size-5 xl:size-6"
          />
          <p className="text-[11px] leading-tight font-medium sm:text-xs xl:text-sm">
            Couldn’t load data
          </p>
          <p className="hidden text-[10px] text-muted-foreground md:block xl:text-xs">
            Please try again in a moment.
          </p>
          <Button
            size="sm"
            disabled={retryPending}
            onClick={() => retry()}
            className="h-6 px-2 text-[11px] sm:h-7 sm:text-xs xl:h-8 xl:text-sm"
          >
            {retryPending ? "Retrying…" : "Retry"}
          </Button>
          {!isProd && (
            <details className="hidden max-w-full text-[10px] text-muted-foreground xl:block xl:text-xs">
              <summary className="cursor-pointer select-none">
                Technical details
              </summary>
              <div className="mt-1 max-h-16 overflow-auto text-left wrap-break-word whitespace-pre-wrap xl:max-h-24">
                {error.message}
              </div>
            </details>
          )}
        </div>
      </ViewTransition>
    </>
  );
}
