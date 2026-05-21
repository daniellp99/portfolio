"use client";

import { useId, useMemo } from "react";

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

/** Match StackIcon: unique clip-path ids per instance (carousel renders duplicates). */
function uniquifySvgIds(svg: string, instancePrefix: string): string {
  const safePrefix = instancePrefix.replace(/[^a-zA-Z0-9_-]/g, "_");
  const ids = Array.from(svg.matchAll(/\bid="([^"]+)"/g), (m) => m[1]).concat(
    Array.from(svg.matchAll(/href="#([^"]+)"/g), (m) => m[1]),
  );

  let out = svg;
  for (const oldId of Array.from(new Set(ids))) {
    const newId = `${safePrefix}-${oldId}`;
    out = out.replaceAll(`id="${oldId}"`, `id="${newId}"`);
    out = out.replaceAll(`url(#${oldId})`, `url(#${newId})`);
    out = out.replaceAll(`href="#${oldId}"`, `href="#${newId}"`);
  }
  return out;
}

export function SkillStackIcon({
  name,
  variant = "dark",
  className,
}: SkillStackIconProps) {
  const instanceId = useId();
  const entry = STACK_ICONS[name];

  const svgHtml = useMemo(() => {
    if (!entry) return null;
    return uniquifySvgIds(entry[variant], instanceId);
  }, [entry, variant, instanceId]);

  if (!svgHtml) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[SkillStackIcon] Unknown icon key: ${name}`);
    }
    return null;
  }

  return (
    <span
      className={cn("inline-block leading-0", className)}
      style={{ lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}
