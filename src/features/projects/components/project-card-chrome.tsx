"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState, ViewTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CardGrayscale } from "@/components/ui/grayscale";

import { capture } from "@/lib/analytics";
import type { Project } from "@/lib/content/display";
import { UI_SPRING } from "@/lib/motion";

export default function ProjectCardChrome({
  project,
  children,
}: {
  project: Pick<Project, "slug" | "name">;
  children: ReactNode;
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
      {children}
      <motion.div className="cancelDrag absolute bottom-2 left-2">
        <Button
          variant="projectLink"
          className="relative flex w-fit items-center overflow-hidden p-2"
          size="icon-lg"
          render={
            <Link
              href={`/project/${project.slug}`}
              prefetch={true}
              transitionTypes={["nav-forward"]}
              onClick={() =>
                capture("project_card_clicked", {
                  project_slug: project.slug,
                  project_name: project.name,
                })
              }
            />
          }
          nativeButton={false}
        >
          <ViewTransition
            name={`project-title-${project.slug}`}
            share="text-morph"
            default="none"
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
          </ViewTransition>
          <ArrowUpRightIcon className="absolute right-2 size-5" />
        </Button>
      </motion.div>
    </CardGrayscale>
  );
}
