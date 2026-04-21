import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Project } from "@/lib/server/project-dto";
import { MAIN_GRID_CARD_IMAGE_SIZES } from "@/lib/site/image-sizes";
import { cn } from "@/lib/utils";

export default function ProjectCard({
  project,
  eager = false,
}: {
  project: Project;
  /** First visible project tiles: eager load (avoid `preload` when several may be LCP). */
  eager?: boolean;
}) {
  return (
    <div className="group relative size-full">
      <Image
        className={cn("rounded-lg shadow-2xl")}
        alt={project.name}
        src={`/${project.coverImage}`}
        fill
        loading={eager ? "eager" : "lazy"}
        sizes={MAIN_GRID_CARD_IMAGE_SIZES}
        quality={92}
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
