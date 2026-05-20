import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import ProjectCardClient from "@/components/ProjectCardClient";

import { getProjectSummary } from "@/lib/server/projects";

function ProjectCardFallback() {
  return <Skeleton className="size-full" />;
}

export default function ProjectCard({ projectSlug }: { projectSlug: string }) {
  const projectPromise = getProjectSummary(projectSlug);

  return (
    <Suspense fallback={<ProjectCardFallback />}>
      <ProjectCardClient projectPromise={projectPromise} />
    </Suspense>
  );
}
