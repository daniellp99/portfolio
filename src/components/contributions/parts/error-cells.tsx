"use client";

import { getMonth } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { AlertTriangleIcon } from "lucide-react";

import { useContributionsBoundary } from "@/components/contributions/parts/boundary";
import { ContributionsCell } from "@/components/contributions/parts/cell";
import { Button } from "@/components/ui/button";

import {
  getMonthHeatmapGridDates,
  getMonthStartInZone,
} from "@/lib/contributions/calendar-projection";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

export function ContributionsErrorCells({
  error,
  resetErrorBoundary,
  className,
}: {
  error: Error;
  resetErrorBoundary: () => void;
  className?: string;
}) {
  const { year, month, retry } = useContributionsBoundary();

  const isProd = process.env.NODE_ENV === "production";
  const monthStart = getMonthStartInZone(year, month);
  const dates = getMonthHeatmapGridDates(year, month);

  return (
    <div className={cn("relative", className)}>
      <ol
        aria-hidden="true"
        inert
        className="grid grid-cols-7 place-items-stretch gap-1 xl:gap-2"
      >
        {dates.map((d) => {
          const iso = formatInTimeZone(d, CONTRIBUTIONS_TZ, "yyyy-MM-dd");
          const isOutside = getMonth(d) !== getMonth(monthStart);
          return (
            <ContributionsCell key={iso} state="error" outside={isOutside} />
          );
        })}
      </ol>

      <div
        role="alert"
        aria-live="polite"
        className="absolute -inset-0.5 grid place-items-center rounded backdrop-blur-xs"
      >
        <div className="flex max-w-full flex-col items-center gap-1 px-2 text-center">
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
            onClick={() => {
              resetErrorBoundary();
              retry();
            }}
            className="h-6 px-2 text-[11px] sm:h-7 sm:text-xs xl:h-8 xl:text-sm"
          >
            Retry
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
      </div>
    </div>
  );
}
