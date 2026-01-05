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
          "--image-url": `url(/${project.bgImage})`,
        } as React.CSSProperties
      }
      className={cn(
        "group relative size-full dark:bg-none",
        !!project.bgImage && "bg-(image:--image-url) bg-cover",
      )}
    >
      <Image
        className={cn(
          "rounded-lg shadow-2xl",
          isHorizontal ? "origin-top -rotate-30" : "origin-right -rotate-45",
        )}
        alt={project.name}
        src={`/${project.coverImage}`}
        fill
        sizes="50vw"
        style={{
          objectFit: "cover",
        }}
      />
      <Button
        variant="projectLink"
        className="cancelDrag absolute bottom-3 left-3 flex w-fit items-center overflow-hidden p-2 transition duration-150 ease-linear"
        size="icon-lg"
        render={<Link href={`/project/${project.slug}`} />}
        nativeButton={false}
      >
        <p className="max-w-0 -translate-x-full truncate pr-5 text-sm font-bold opacity-0 transition-all delay-75 duration-300 ease-linear group-hover:max-w-[116px] group-hover:translate-x-0 group-hover:opacity-100 md:group-hover:max-w-[152px] lg:group-hover:max-w-[252px]">
          {project.name}
        </p>
        <ArrowUpRightIcon className="absolute right-2 size-5" />
      </Button>
    </div>
  );
}
