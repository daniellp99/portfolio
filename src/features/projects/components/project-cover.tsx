import Image from "next/image";
import { ViewTransition } from "react";

import { PROJECT_DETAIL_COVER_IMAGE_SIZES } from "@/lib/site/image-sizes";
import { cn } from "@/lib/utils";

/** Shared cover morph pair: home card ↔ project detail hero. */
export function projectCoverTransitionName(slug: string) {
  return `project-cover-${slug}`;
}

/** Card cover — positioned fill host so ViewTransition does not break `fill`. */
export function ProjectCardCover({
  slug,
  src,
  alt,
  priority = false,
  sizes,
  className,
}: {
  slug: string;
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <ViewTransition
      name={projectCoverTransitionName(slug)}
      share="morph"
      default="none"
    >
      <div className={cn("absolute inset-0", className)}>
        <Image
          className="rounded-lg object-scale-down object-top px-4"
          alt={alt}
          src={src}
          fill
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
        />
      </div>
    </ViewTransition>
  );
}

/** Detail-page morph target for the home card cover. */
export function ProjectDetailCover({
  slug,
  coverImage,
  name,
}: {
  slug: string;
  coverImage: string;
  name: string;
}) {
  const src = coverImage.startsWith("/") ? coverImage : `/${coverImage}`;

  return (
    <ViewTransition
      name={projectCoverTransitionName(slug)}
      share="morph"
      default="none"
    >
      <div
        data-testid="project-cover"
        className="relative aspect-video w-full max-w-xl overflow-hidden rounded-lg"
      >
        <Image
          className="rounded-lg object-cover object-top"
          alt={`${name} cover`}
          src={src}
          fill
          sizes={PROJECT_DETAIL_COVER_IMAGE_SIZES}
          priority
        />
      </div>
    </ViewTransition>
  );
}
