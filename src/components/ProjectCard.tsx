"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CardGrayscale } from "@/components/ui/grayscale";

import { UI_SPRING } from "@/lib/motion";
import { Project } from "@/lib/server/project-dto";
import { MAIN_GRID_CARD_IMAGE_SIZES } from "@/lib/site/image-sizes";

export default function ProjectCard({
  project,
  eager = false,
}: {
  project: Project;
  /** First visible project tiles: eager load (avoid `preload` when several may be LCP). */
  eager?: boolean;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [isHovered, setIsHovered] = useState(false);

  const transition = reduceMotion
    ? { duration: 0 }
    : { ...UI_SPRING, duration: 0.5 };

  return (
    <CardGrayscale
      className="group relative size-full"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Image
        className="rounded-lg px-4"
        alt={project.name}
        src={`/${project.coverImage}`}
        fill
        loading={eager ? "eager" : "lazy"}
        sizes={MAIN_GRID_CARD_IMAGE_SIZES}
        quality={92}
        style={{
          objectFit: "scale-down",
          objectPosition: "top",
        }}
      />
      <motion.div className="cancelDrag absolute bottom-2 left-2">
        <Button
          variant="projectLink"
          className="relative flex w-fit items-center overflow-hidden p-2"
          size="icon-lg"
          render={<Link href={`/project/${project.slug}`} />}
          nativeButton={false}
        >
          <motion.p
            initial={false}
            animate={
              isHovered
                ? {
                    maxWidth: 252,
                    x: 0,
                    opacity: 1,
                  }
                : {
                    maxWidth: 0,
                    x: -18,
                    opacity: 0,
                  }
            }
            transition={transition}
            className="truncate pr-5 text-sm font-bold"
          >
            {project.name}
          </motion.p>
          <ArrowUpRightIcon className="absolute right-2 size-5" />
        </Button>
      </motion.div>
    </CardGrayscale>
  );
}
