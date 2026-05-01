"use client";

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
  onPointerDownCapture,
  ...props
}: CardGrayscaleProps) {
  const [pressed, setPressed] = React.useState(false);

  React.useEffect(() => {
    if (!pressed) return;
    function clear() {
      setPressed(false);
    }
    window.addEventListener("pointerup", clear);
    window.addEventListener("pointercancel", clear);
    return () => {
      window.removeEventListener("pointerup", clear);
      window.removeEventListener("pointercancel", clear);
    };
  }, [pressed]);

  return (
    <div
      data-pressed={pressed ? "true" : undefined}
      onPointerDownCapture={(e) => {
        onPointerDownCapture?.(e);
        if (e.defaultPrevented) return;
        setPressed(true);
      }}
      className={cn(
        "relative overflow-hidden grayscale transition-[filter]",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:grayscale-0",
        "data-[pressed=true]:grayscale-0",
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
