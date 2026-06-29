import { cn } from "@/lib/utils";

type SkeletonStyle = React.CSSProperties & {
  "--loader-skeleton-duration"?: string;
  "--loader-skeleton-gradient"?: string;
};

type SkeletonProps<T extends React.ElementType = "div"> = {
  as?: T;
  highlightColor?: string;
  duration?: number;
} & React.ComponentPropsWithoutRef<T>;

function Skeleton<T extends React.ElementType = "div">({
  as,
  className,
  highlightColor,
  duration = 1.5,
  style,
  ...props
}: SkeletonProps<T>) {
  const Component = as ?? "div";
  const skeletonStyle: SkeletonStyle = {
    ...style,
    "--loader-skeleton-duration": `${duration}s`,
    "--loader-skeleton-gradient": `linear-gradient(90deg, transparent, ${
      highlightColor ?? "rgba(255, 255, 255, 0.3)"
    }, transparent)`,
  };
  return (
    <Component
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
