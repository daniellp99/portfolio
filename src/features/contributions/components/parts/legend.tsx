import { bucketClass } from "@/features/contributions/lib/intensity";
import { cn } from "@/lib/utils";

export function ContributionsLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "hidden items-center justify-center gap-2 pt-4 xl:flex",
        className,
      )}
      aria-hidden="true"
    >
      <span className="text-xs text-muted-foreground">Less</span>
      <ol className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <li
            key={idx}
            className={cn(
              "size-4 rounded ring-1 ring-foreground/10",
              bucketClass(idx),
            )}
          />
        ))}
      </ol>
      <span className="text-xs text-muted-foreground">More</span>
    </div>
  );
}
