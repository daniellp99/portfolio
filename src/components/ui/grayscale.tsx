"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export interface CardGrayscaleProps extends React.ComponentProps<"div"> {
  image?: string;
  children?: React.ReactNode;
  /** Filter transition duration in seconds */
  duration?: number;
}

type CardGrayscaleStyle = React.CSSProperties & {
  "--grayscale-duration"?: string;
  "--card-image"?: string;
};

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

  const grayscaleStyle = {
    ...style,
    "--grayscale-duration": `${duration}s`,
  } as CardGrayscaleStyle;

  return (
    <div
      data-pressed={pressed ? "true" : undefined}
      onPointerDownCapture={(e) => {
        onPointerDownCapture?.(e);
        if (e.defaultPrevented) return;
        setPressed(true);
      }}
      className={cn(
        "relative overflow-hidden grayscale transition-[filter] [transition-duration:var(--grayscale-duration)] ease-out",
        "[@media(hover:hover)_and_(pointer:fine)]:hover:grayscale-0",
        "data-[pressed=true]:grayscale-0",
        "motion-reduce:grayscale-0 motion-reduce:transition-none",
        className,
      )}
      style={grayscaleStyle}
      {...props}
    >
      {image ? (
        <div
          className="absolute inset-0 bg-cover bg-center [background-image:var(--card-image)]"
          style={
            { "--card-image": `url(${image})` } as CardGrayscaleStyle
          }
        />
      ) : null}
      {children}
    </div>
  );
}
