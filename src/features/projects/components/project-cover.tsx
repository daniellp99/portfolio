import Image from "next/image";
import { ViewTransition } from "react";

import { PROJECT_DETAIL_COVER_IMAGE_SIZES } from "@/lib/site/image-sizes";
import { cn } from "@/lib/utils";

function projectCoverTransitionName(slug: string) {
  return `project-cover-${slug}`;
}

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
        className="relative mx-auto aspect-square w-full max-w-md"
      >
        <Image
          className="rounded-lg object-scale-down object-center"
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
