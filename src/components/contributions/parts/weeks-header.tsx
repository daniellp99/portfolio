import { WEEKDAY_LABELS } from "@/lib/contributions/weekday-labels";
import { cn } from "@/lib/utils";

export function ContributionsWeeksHeader({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid grid-cols-7 place-items-stretch gap-1 xl:gap-2",
        className,
      )}
    >
      {WEEKDAY_LABELS.map(({ short, initial }) => (
        <span
          key={short}
          className="text-center text-xs/2 text-muted-foreground"
        >
          <span className="xl:hidden">{initial}</span>
          <span className="hidden xl:inline">{short}</span>
        </span>
      ))}
    </div>
  );
}
