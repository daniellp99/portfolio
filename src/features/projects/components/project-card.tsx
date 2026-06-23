import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import ProjectCardClient from "@/features/projects/components/project-card-client";
import { getProjectSummary } from "@/features/projects/projects-queries";

function ProjectCardSkeleton() {
  return <Skeleton className="size-full" />;
}

export function ProjectCard({ projectSlug }: { projectSlug: string }) {
  const projectPromise = getProjectSummary(projectSlug);

  return (
    <Suspense fallback={<ProjectCardSkeleton />}>
      <ProjectCardClient projectPromise={projectPromise} />
    </Suspense>
  );
}
