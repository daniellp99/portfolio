/* eslint-disable @next/next/no-img-element -- local SVG vectors; next/image rasterizes small icons */
import type { SkillIconKey } from "@/lib/icons/stack-icon-keys";
import { cn } from "@/lib/utils";

type SkillStackIconVariant = "light" | "dark";

export type SkillStackIconProps = {
  name: SkillIconKey;
  variant?: SkillStackIconVariant;
  className?: string;
};

export function stackIconSrc(
  name: SkillIconKey,
  variant: SkillStackIconVariant,
): string {
  return `/icons/${name}-${variant}.svg`;
}

export function SkillStackIcon({
  name,
  variant = "dark",
  className,
}: SkillStackIconProps) {
  return (
    <img
      src={stackIconSrc(name, variant)}
      alt=""
      decoding="async"
      className={cn(
        "inline-block aspect-square max-w-none shrink-0",
        className,
      )}
    />
  );
}
