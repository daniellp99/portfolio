"use client";

import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { CardGrayscale } from "@/components/ui/grayscale";

import { capture } from "@/lib/analytics";
import type { Project } from "@/lib/content/display";

export default function ProjectCardChrome({
  project,
  children,
}: {
  project: Pick<Project, "slug" | "name">;
  children: ReactNode;
}) {
  return (
    <CardGrayscale className="group relative size-full">
      {children}
      <div className="cancelDrag absolute bottom-2 left-2">
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
            <p
              className="max-w-0 -translate-x-[18px] truncate pr-5 text-sm font-bold opacity-0 transition-[max-width,translate,opacity] duration-500 ease-out group-hover:max-w-[252px] group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none group-focus-within:max-w-[252px] group-focus-within:translate-x-0 group-focus-within:opacity-100"
            >
              {project.name}
            </p>
          </ViewTransition>
          <ArrowUpRightIcon data-icon="inline-end" className="absolute right-2 size-5" />
        </Button>
      </div>
    </CardGrayscale>
  );
}
