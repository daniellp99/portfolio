import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type SkeletonStyle = React.CSSProperties & {
  "--loader-skeleton-duration"?: string;
  "--loader-skeleton-gradient"?: string;
};

const skeletonVariants = cva(
  [
    "relative overflow-hidden bg-muted-foreground dark:bg-muted",
    "before:pointer-events-none before:absolute before:inset-0 before:content-['']",
    "before:[background-image:var(--loader-skeleton-gradient)]",
    "motion-safe:before:animate-skeleton-shimmer motion-reduce:before:animate-none",
  ],
  {
    variants: {
      variant: {
        default: "rounded-md",
        pill: "rounded-full",
        cell: "rounded-sm ring-1 ring-foreground/10",
        media: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type SkeletonProps<T extends React.ElementType = "div"> = {
  as?: T;
  highlightColor?: string;
  duration?: number;
  variant?: VariantProps<typeof skeletonVariants>["variant"];
} & React.ComponentPropsWithoutRef<T>;

function Skeleton<T extends React.ElementType = "div">({
  as,
  className,
  highlightColor,
  duration = 1.5,
  variant = "default",
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
      className={cn(skeletonVariants({ variant }), className)}
      style={skeletonStyle}
      {...props}
    />
  );
}

export { Skeleton };
