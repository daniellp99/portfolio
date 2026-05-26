"use client";

import { Popover as PopoverBase } from "@base-ui/react/popover";
import { getMonth } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { use, type ReactNode } from "react";

import { ContributionsCell } from "@/components/contributions/parts/cell";
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
import { intensityBucket } from "@/lib/contributions/intensity";
import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

import type { ContributionsCellBucket } from "@/components/contributions/parts/cell";

const contributionsPopoverHandle = PopoverBase.createHandle<ReactNode>();

export function ContributionsDataCells({
  contributionsPromise,
  className,
}: {
  contributionsPromise: Promise<GithubContributionMonthResponse>;
  className?: string;
}) {
  const openOnHover = usePrefersFinePointer();
  const data = use(contributionsPromise);
  const { year, month } = data;

  const byDate = contributionCountsByIsoDate(data.calendar);
  const monthStart = getMonthStartInZone(year, month);
  const dates = getMonthHeatmapGridDates(year, month);
  const max = Math.max(...Array.from(byDate.values()), 0);

  return (
    <ol
      className={cn(
        "grid grid-cols-7 place-items-stretch gap-1 xl:gap-2",
        className,
      )}
    >
      {dates.map((d) => {
        const iso = formatInTimeZone(d, CONTRIBUTIONS_TZ, "yyyy-MM-dd");
        const isOutside = getMonth(d) !== getMonth(monthStart);
        const count = byDate.get(iso) ?? 0;
        const bucket = (
          isOutside ? 0 : intensityBucket(count, max)
        ) as ContributionsCellBucket;
        const label = formatContributionDayTooltip(iso, count);

        return (
          <ContributionsCell
            key={iso}
            state="idle"
            outside={isOutside}
            bucket={bucket}
            className={cn(
              "cancelDrag",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
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
          </ContributionsCell>
        );
      })}

      <Popover handle={contributionsPopoverHandle}>
        {({ payload }) => (
          <PopoverContent
            variant="tooltip"
            side="top"
            align="center"
            sideOffset={4}
          >
            {payload}
          </PopoverContent>
        )}
      </Popover>
    </ol>
  );
}
