import { Skeleton } from "@/components/ui/skeleton";

import ProjectCardChrome from "@/features/projects/components/project-card-chrome";
import { ProjectCardCover } from "@/features/projects/components/project-cover";
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
      <ProjectCardCover
        slug={project.slug}
        src={`/${project.coverImage}`}
        alt={project.name}
        sizes={MAIN_GRID_CARD_IMAGE_SIZES}
        priority={priority}
      />
    </ProjectCardChrome>
  );
}
