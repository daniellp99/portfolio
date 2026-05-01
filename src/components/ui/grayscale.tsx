import { cn } from "@/lib/utils";
import * as React from "react";

export interface CardGrayscaleProps extends React.ComponentProps<"div"> {
  image?: string;
  children?: React.ReactNode;
  /** Filter transition duration in seconds */
  duration?: number;
}

export function CardGrayscale({
  image,
  children,
  className,
  duration = 0.5,
  style,
  ...props
}: CardGrayscaleProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden grayscale transition-[filter]",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:grayscale-0",
        "active:grayscale-0",
        "motion-reduce:grayscale-0 motion-reduce:transition-none",
        className,
      )}
      style={{
        transitionDuration: `${duration}s`,
        transitionTimingFunction: "ease-out",
        ...style,
      }}
      {...props}
    >
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      {children}
    </div>
  );
}
