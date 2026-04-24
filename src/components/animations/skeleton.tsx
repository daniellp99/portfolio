"use client";
import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "motion/react";
export interface LoaderSkeletonProps extends HTMLMotionProps<"div"> {
  highlightColor?: string;
  duration?: number;
}
export function LoaderSkeleton({
  className,
  highlightColor,
  duration = 1.5,
  ...props
}: LoaderSkeletonProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-muted", className)}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${
            highlightColor || "rgba(255, 255, 255, 0.3)"
          }, transparent)`,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        {...props}
      />
    </div>
  );
}
