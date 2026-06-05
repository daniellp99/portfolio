import { Skeleton } from "@/components/ui/skeleton";

import { monthGridCellCount } from "@/lib/contributions/calendar-projection";
import { cn } from "@/lib/utils";

export function ContributionsLoadingCells({
  year,
  month,
  className,
}: {
  year: number;
  month: number;
  className?: string;
}) {
  const cellCount = monthGridCellCount(year, month);

  return (
    <ol
      aria-hidden="true"
      className={cn(
        "grid grid-cols-7 place-items-stretch gap-1 [grid-area:cells] xl:gap-2",
        className,
      )}
    >
      {Array.from({ length: cellCount }).map((_, idx) => (
        <Skeleton
          key={idx}
          className="aspect-square rounded ring-1 ring-foreground/10"
        />
      ))}
    </ol>
  );
}
