import type { ComponentProps, ReactNode } from "react";

import { bucketClass } from "@/lib/contributions/intensity";
import { cn } from "@/lib/utils";

export type ContributionsCellState = "idle" | "loading" | "error";
export type ContributionsCellBucket = 0 | 1 | 2 | 3 | 4;

export function ContributionsCell({
  state = "idle",
  outside = false,
  bucket = 0,
  className,
  children,
  ...rest
}: Omit<ComponentProps<"li">, "children"> & {
  state?: ContributionsCellState;
  outside?: boolean;
  bucket?: ContributionsCellBucket;
  children?: ReactNode;
}) {
  return (
    <li
      data-state={state}
      data-outside={outside || undefined}
      data-bucket={outside ? undefined : bucket}
      className={cn(
        "grid aspect-square place-content-stretch rounded ring-1 ring-foreground/10",
        state === "idle" && !outside && bucketClass(bucket),
        // loading: same look as <Skeleton>
        "data-[state=loading]:bg-muted-foreground dark:data-[state=loading]:bg-muted",
        "motion-safe:data-[state=loading]:animate-pulse",
        // error
        "data-[state=error]:bg-destructive/25 data-[state=error]:ring-destructive/40",
        // outside-month overrides (bucketClass is skipped when outside)
        "data-outside:bg-transparent data-outside:ring-foreground/5",
        "data-[state=error]:data-outside:bg-transparent data-[state=error]:data-outside:ring-destructive/15",
        className,
      )}
      {...rest}
    >
      {children}
    </li>
  );
}
