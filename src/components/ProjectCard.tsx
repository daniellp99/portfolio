import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Project } from "@/data/project-dto";
import { cn } from "@/lib/utils";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative size-full">
      <Image
        className={cn("rounded-lg shadow-2xl")}
        alt={project.name}
        src={`/${project.coverImage}`}
        fill
        sizes="50vw"
        style={{
          objectFit: "contain",
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
