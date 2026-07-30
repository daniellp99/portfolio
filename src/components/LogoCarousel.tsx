"use client";

import { CardGrayscale } from "@/components/ui/grayscale";

import { useSkillHoverSetter } from "@/components/SkillHoverContext";
import type { Logo } from "@/lib/content/display";
import { SkillStackIcon } from "@/lib/icons/SkillStackIcon";
import { cn } from "@/lib/utils";

function LogoLink({
  logo,
  onHover,
}: {
  logo: Logo;
  onHover: (title: string | null) => void;
}) {
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={logo.title}
      className="block shrink-0 px-3 py-2 transition-transform duration-200 hover:scale-110 active:scale-110"
      onPointerEnter={() => onHover(logo.title)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(logo.title)}
      onBlur={() => onHover(null)}
    >
      <CardGrayscale
        duration={0.2}
        className="inline-flex items-center justify-center"
      >
        <figure role="img" aria-label={`${logo.title} logo`}>
          <SkillStackIcon
            name={logo.key}
            className="aspect-square size-10 xl:size-16"
          />
        </figure>
      </CardGrayscale>
    </a>
  );
}

export function LogoCarousel({
  logos,
  direction = "ltr",
}: {
  logos: Logo[];
  direction?: "ltr" | "rtl";
}) {
  const setHoveredTitle = useSkillHoverSetter();

  if (logos.length === 0) return null;

  const track = logos.map((logo, idx) => (
    <LogoLink
      key={`${direction}-${logo.title}-${idx}`}
      logo={logo}
      onHover={setHoveredTitle}
    />
  ));

  return (
    <div
      aria-label="Tech stack logos carousel"
      className="logo-marquee w-full overflow-hidden"
      data-direction={direction}
    >
      <div
        className={cn(
          "logo-marquee-track flex w-max",
          direction === "rtl" && "logo-marquee-track-rtl",
        )}
      >
        <div className="flex">{track}</div>
        <div className="flex" aria-hidden="true">
          {track}
        </div>
      </div>
    </div>
  );
}
