"use client";
import AutoScroll from "embla-carousel-auto-scroll";
import { useTheme } from "next-themes";
import { useId } from "react";
import StackIcon from "tech-stack-icons";

import { useSkillHover } from "@/components/SkillHoverContext";
import type { CarouselOptions } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CardGrayscale } from "@/components/ui/grayscale";

import type { Logo } from "@/lib/content/display";

export function LogoCarousel({
  logos,
  opts,
}: {
  logos: Logo[];
  opts?: CarouselOptions;
}) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const { setHoveredTitle } = useSkillHover();

  if (logos.length === 0) return null;

  return (
    <Carousel
      aria-label="Tech stack logos carousel"
      plugins={[
        AutoScroll({
          speed: 0.6,
          stopOnMouseEnter: true,
          stopOnFocusIn: true,
          stopOnInteraction: false,
        }),
      ]}
      dir={opts?.direction}
      opts={{
        loop: true,
        dragFree: true,
        align: "center",
        ...opts,
      }}
    >
      <CarouselContent className="ml-0">
        {logos.map((logo, idx) => (
          <CarouselItem
            key={`${logo.title}-${idx}-${id}`}
            className="basis-1/13 pl-0"
          >
            <a
              href={logo.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={logo.title}
              className="block p-2 transition-transform duration-200 hover:scale-110 active:scale-110"
              onPointerEnter={() => setHoveredTitle(logo.title)}
              onPointerLeave={() => setHoveredTitle(null)}
              onFocus={() => setHoveredTitle(logo.title)}
              onBlur={() => setHoveredTitle(null)}
            >
              <CardGrayscale
                duration={0.2}
                className="inline-flex items-center justify-center"
              >
                <figure role="img" aria-label={`${logo.title} logo`}>
                  <StackIcon
                    name={logo.key}
                    variant={resolvedTheme === "light" ? "light" : "dark"}
                    className="aspect-square size-10 xl:size-16"
                  />
                </figure>
              </CardGrayscale>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
