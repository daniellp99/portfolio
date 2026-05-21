"use client";

import {
  STACK_ICONS,
  type SkillIconKey,
} from "@/lib/icons/stack-icons.generated";
import { cn } from "@/lib/utils";

type SkillStackIconVariant = "light" | "dark";

export type SkillStackIconProps = {
  name: SkillIconKey;
  variant?: SkillStackIconVariant;
  className?: string;
};

export function SkillStackIcon({
  name,
  variant = "dark",
  className,
}: SkillStackIconProps) {
  const entry = STACK_ICONS[name];
  if (!entry) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[SkillStackIcon] Unknown icon key: ${name}`);
    }
    return null;
  }

  const svg = entry[variant];

  return (
    <span
      className={cn("inline-block [&>svg]:h-full [&>svg]:w-full", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
