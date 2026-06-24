import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";

import ProjectCardChrome from "@/features/projects/components/project-card-chrome";
import { getProjectSummary } from "@/features/projects/projects-queries";
import { MAIN_GRID_CARD_IMAGE_SIZES } from "@/lib/site/image-sizes";

export function ProjectCardSkeleton() {
  return <Skeleton className="size-full" />;
}

export async function ProjectCard({
  projectSlug,
  priority = false,
}: {
  projectSlug: string;
  priority?: boolean;
}) {
  const project = await getProjectSummary(projectSlug);

  return (
    <ProjectCardChrome project={project}>
      <Image
        className="rounded-lg px-4"
        alt={project.name}
        src={`/${project.coverImage}`}
        fill
        loading={priority ? "eager" : "lazy"}
        sizes={MAIN_GRID_CARD_IMAGE_SIZES}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        style={{
          objectFit: "scale-down",
          objectPosition: "top",
        }}
      />
    </ProjectCardChrome>
  );
}
