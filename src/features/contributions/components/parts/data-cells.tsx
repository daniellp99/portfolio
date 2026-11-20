"use client";

import { createPopoverController } from "@ui-sdk/react/popover";
import { type ReactNode, useState } from "react";

import { ContributionsCell } from "@/features/contributions/components/parts/cell";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { usePrefersFinePointer } from "@/hooks/use-prefers-fine-pointer";
import type { ContributionHeatmapCell } from "@/features/contributions/lib/calendar-projection";
import { cn } from "@/lib/utils";

import type { ContributionsCellBucket } from "@/features/contributions/components/parts/cell";

export function ContributionsDataCells({
  cells,
  className,
}: {
  cells: ContributionHeatmapCell[];
  className?: string;
}) {
  const openOnHover = usePrefersFinePointer();
  const [popover] = useState(() => createPopoverController<ReactNode>());

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
            controller={popover}
            payload={label}
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

      <Popover
        controller={popover}
        openOnHover={openOnHover}
        delay={openOnHover ? 0 : undefined}
        closeDelay={openOnHover ? 0 : undefined}
      >
        <PopoverContent<ReactNode>
          variant="tooltip"
          side="top"
          align="center"
          sideOffset={4}
        >
          {(state) => state.payload}
        </PopoverContent>
      </Popover>
    </ol>
  );
}
