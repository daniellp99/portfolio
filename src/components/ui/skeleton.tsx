import { cn } from "@/lib/utils";

type SkeletonStyle = React.CSSProperties & {
  "--loader-skeleton-duration"?: string;
  "--loader-skeleton-gradient"?: string;
};

function Skeleton({
  className,
  highlightColor,
  duration = 1.5,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  highlightColor?: string;
  duration?: number;
}) {
  const skeletonStyle: SkeletonStyle = {
    ...style,
    "--loader-skeleton-duration": `${duration}s`,
    "--loader-skeleton-gradient": `linear-gradient(90deg, transparent, ${
      highlightColor ?? "rgba(255, 255, 255, 0.3)"
    }, transparent)`,
  };
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted-foreground dark:bg-muted",
        "before:pointer-events-none before:absolute before:inset-0 before:content-['']",
        "before:[background-image:var(--loader-skeleton-gradient)]",
        "motion-safe:before:animate-skeleton-shimmer motion-reduce:before:animate-none",
        className,
      )}
      style={skeletonStyle}
      {...props}
    />
  );
}

export { Skeleton };
