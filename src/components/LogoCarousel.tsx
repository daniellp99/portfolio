"use client";
import AutoScroll from "embla-carousel-auto-scroll";
import { useId } from "react";
import StackIcon, { type IconName } from "tech-stack-icons";

import { CardGrayscale } from "@/components/animations/grayscale";
import type { CarouselOptions } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTheme } from "next-themes";

export type Logo = {
  key: IconName;
  href: string;
  title: string;
};

export function LogoCarousel({
  logos,
  opts,
}: {
  logos: Logo[];
  opts?: CarouselOptions;
}) {
  const id = useId();
  const { resolvedTheme } = useTheme();

  if (logos.length === 0) return null;

  return (
    <Carousel
      plugins={[
        AutoScroll({
          speed: 0.8,
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
            className="basis-1/12 pl-0 md:basis-1/11 xl:basis-1/10"
          >
            <a
              href={logo.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={logo.title}
              className="block p-2 transition-transform duration-200 hover:scale-110"
            >
              <CardGrayscale
                duration={0.2}
                className="inline-flex items-center justify-center"
              >
                <figure role="img" aria-label={`${logo.title} logo`}>
                  <StackIcon
                    name={logo.key}
                    variant={resolvedTheme === "light" ? "light" : "dark"}
                    className="size-10 xl:size-16"
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
