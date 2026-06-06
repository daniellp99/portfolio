"use client";

import { Popover as PopoverBase } from "@base-ui/react/popover";
import { type ReactNode } from "react";

import { ContributionsCell } from "@/components/contributions/parts/cell";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { usePrefersFinePointer } from "@/hooks/use-prefers-fine-pointer";
import type { ContributionHeatmapCell } from "@/lib/contributions/calendar-projection";
import { cn } from "@/lib/utils";

import type { ContributionsCellBucket } from "@/components/contributions/parts/cell";

const contributionsPopoverHandle = PopoverBase.createHandle<ReactNode>();

export function ContributionsDataCells({
  cells,
  className,
}: {
  cells: ContributionHeatmapCell[];
  className?: string;
}) {
  const openOnHover = usePrefersFinePointer();

  return (
    <ol
      className={cn(
        "grid grid-cols-7 place-items-stretch gap-1 [grid-area:cells] xl:gap-2",
        className,
      )}
    >
      {cells.map(({ iso, outside, bucket, label }) => (
        <ContributionsCell
          key={iso}
          state="idle"
          outside={outside}
          bucket={bucket as ContributionsCellBucket}
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
                aria-hidden={outside || undefined}
                tabIndex={outside ? -1 : 0}
                disabled={outside}
              />
            }
          />
        </ContributionsCell>
      ))}

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
