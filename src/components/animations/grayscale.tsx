"use client";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "motion/react";
import * as React from "react";
export interface CardGrayscaleProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  image?: string;
  children?: React.ReactNode;
  duration?: number;
}
export function CardGrayscale({
  image,
  children,
  className,
  duration = 0.5,
  ...props
}: CardGrayscaleProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const { onHoverStart, onHoverEnd, ...rest } = props;
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      onHoverStart={(event, info) => {
        setIsHovered(true);
        onHoverStart?.(event, info);
      }}
      onHoverEnd={(event, info) => {
        setIsHovered(false);
        onHoverEnd?.(event, info);
      }}
      animate={{
        filter: isHovered ? "grayscale(0%)" : "grayscale(100%)",
      }}
      transition={{ duration }}
      {...rest}
    >
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      {children}
    </motion.div>
  );
}
