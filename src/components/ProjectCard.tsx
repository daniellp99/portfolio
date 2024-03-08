import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Project } from "@/data/project-dto";
import { cn } from "@/lib/utils";

export default function ProjectCard({
  project,
  isHorizontal,
}: {
  project: Project;
  isHorizontal: boolean;
}) {
  return (
    <div
      style={
        {
          "--image-url": `url(/${project.images[0].bg})`,
        } as React.CSSProperties
      }
      className={cn(
        "group h-full w-full dark:bg-none",
        !!project.images[0].bg && "bg-[image:var(--image-url)] bg-cover",
      )}
    >
      <Image
        className={cn(
          "rounded-lg shadow-2xl",
          isHorizontal
            ? "origin-top -rotate-[30deg]"
            : "origin-right -rotate-45",
        )}
        alt={project.images[0].alt}
        src={`/${project.images[0].image}`}
        width={800}
        height={800}
      />
      <Button
        asChild
        variant="projectLink"
        className="cancelDrag absolute bottom-3 left-3 flex items-center p-2 transition duration-150 ease-linear"
        size="icon"
      >
        <Link
          href={`/project/${project.slug}`}
          className="w-fit overflow-hidden"
        >
          <p className="max-w-0 -translate-x-full truncate pr-5 text-sm font-bold opacity-0 transition-all delay-75 duration-300 ease-linear group-hover:max-w-[116px] group-hover:translate-x-0 group-hover:opacity-100 group-hover:md:max-w-[152px] group-hover:lg:max-w-[252px]">
            {project.name}
          </p>
          <ArrowUpRightIcon className="absolute right-2 size-5" />
        </Link>
      </Button>
    </div>
  );
}
