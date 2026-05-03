"use client";

import { getMonth } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { use, type ReactNode } from "react";
import { Popover as PopoverBase } from "@base-ui/react/popover";

import { ContributionsLegend } from "@/components/contributions/ContributionsLegend";
import { CardDescription } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePrefersFinePointer } from "@/hooks/use-prefers-fine-pointer";
import {
  contributionCountsByIsoDate,
  formatContributionDayTooltip,
  getMonthHeatmapGridDates,
  getMonthStartInZone,
} from "@/lib/contributions/calendar-projection";
import { CONTRIBUTIONS_TZ } from "@/lib/contributions/constants";
import { getContributionsPromise } from "@/lib/contributions/fetch-month";
import { bucketClass, intensityBucket } from "@/lib/contributions/intensity";
import { WEEKDAY_LABELS } from "@/lib/contributions/weekday-labels";
import { cn } from "@/lib/utils";

const contributionsPopoverHandle = PopoverBase.createHandle<ReactNode>();

export function ContributionsHeatmap({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const openOnHover = usePrefersFinePointer();
  const data = use(getContributionsPromise(year, month));

  const byDate = contributionCountsByIsoDate(data.calendar);
  const monthStart = getMonthStartInZone(year, month);
  const dates = getMonthHeatmapGridDates(year, month);
  const max = Math.max(...Array.from(byDate.values()), 0);

  return (
    <>
      <CardDescription className="text-center text-xs">
        {data.calendar.totalContributions} contributions in{" "}
        <span className="hidden md:inline">
          {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMMM yyyy")}
        </span>
        <span className="inline md:hidden">
          {formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMM")}
        </span>
      </CardDescription>

      <ol className="grid grid-cols-7 place-items-stretch gap-1 pt-2 md:pt-4 xl:gap-2">
        {WEEKDAY_LABELS.map(({ short, initial }) => (
          <span
            key={short}
            className="text-center text-xs/2 text-muted-foreground"
            aria-hidden="true"
          >
            <span className="xl:hidden">{initial}</span>
            <span className="hidden xl:inline">{short}</span>
          </span>
        ))}
        {dates.map((d) => {
          const iso = formatInTimeZone(d, CONTRIBUTIONS_TZ, "yyyy-MM-dd");
          const isOutside = getMonth(d) !== getMonth(monthStart);
          const count = byDate.get(iso) ?? 0;
          const bucket = isOutside ? 0 : intensityBucket(count, max);
          const label = formatContributionDayTooltip(iso, count);

          return (
            <li
              key={iso}
              className={cn(
                "cancelDrag grid aspect-square place-content-stretch rounded ring-1 ring-foreground/10",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                isOutside
                  ? "bg-transparent ring-foreground/5"
                  : bucketClass(bucket),
              )}
            >
              <PopoverTrigger
                id={`contributions-day-${iso}`}
                handle={contributionsPopoverHandle}
                payload={label}
                openOnHover={openOnHover}
                delay={openOnHover ? 0 : undefined}
                closeDelay={openOnHover ? 0 : undefined}
                render={
                  <button
                    type="button"
                    aria-label={label}
                    aria-hidden={isOutside || undefined}
                    tabIndex={isOutside ? -1 : 0}
                    disabled={isOutside}
                  />
                }
              />
            </li>
          );
        })}

        <Popover handle={contributionsPopoverHandle}>
          {({ payload: Payload }) => (
            <PopoverContent
              side="top"
              align="center"
              sideOffset={4}
              className={cn(
                "z-50 w-fit max-w-xs min-w-0 flex-col gap-0 rounded-md border-0 bg-foreground px-3 py-1.5 text-xs text-background shadow-md ring-0 duration-100 outline-none",
              )}
            >
              {Payload as ReactNode}
            </PopoverContent>
          )}
        </Popover>
      </ol>

      <ContributionsLegend />
    </>
  );
}
