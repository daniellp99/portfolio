import { ViewTransition } from "react";

import { ProjectDetailSkeleton } from "@/features/projects/components/project-detail";

export default function LoadingPage() {
  return (
    <ViewTransition exit="slide-down">
      <ProjectDetailSkeleton />
    </ViewTransition>
  );
}
