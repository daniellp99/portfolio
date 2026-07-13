/* eslint-disable @next/next/no-img-element -- local SVG vectors; next/image rasterizes small icons */
import type { SkillIconKey } from "@/lib/icons/stack-icon-keys";
import { cn } from "@/lib/utils";

type SkillStackIconVariant = "light" | "dark";

export type SkillStackIconProps = {
  name: SkillIconKey;
  /** Fixed variant. Omit to follow the active color theme via CSS. */
  variant?: SkillStackIconVariant;
  className?: string;
};

function stackIconSrc(
  name: SkillIconKey,
  variant: SkillStackIconVariant,
): string {
  return `/icons/${name}-${variant}.svg`;
}

const iconClassName = "inline-block aspect-square max-w-none shrink-0";

export function SkillStackIcon({
  name,
  variant,
  className,
}: SkillStackIconProps) {
  const classes = cn(iconClassName, className);

  if (variant) {
    return (
      <img
        src={stackIconSrc(name, variant)}
        alt=""
        decoding="async"
        className={classes}
      />
    );
  }

  return (
    <>
      <img
        src={stackIconSrc(name, "light")}
        alt=""
        decoding="async"
        className={cn(classes, "dark:hidden")}
      />
      <img
        src={stackIconSrc(name, "dark")}
        alt=""
        decoding="async"
        className={cn(classes, "hidden dark:inline-block")}
      />
    </>
  );
}
