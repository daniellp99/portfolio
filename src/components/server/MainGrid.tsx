import { Suspense, use } from "react";
import type { ResponsiveLayouts } from "react-grid-layout";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AvatarMarker } from "@/components/avatar-marker";
import GridContainer from "@/components/GridContainer";
import { Map } from "@/components/map";
import AboutMe from "@/components/server/AboutMe";
import ContributionsCard from "@/components/server/ContributionsCard";
import ProjectCard from "@/components/server/ProjectCard";
import SkillsCard from "@/components/server/SkillsCard";
import ThemeToggle from "@/components/ThemeToggle";
import { AVATAR_MARKER_ROOT_ID } from "@/lib/site/avatar-marker";

import type { ProjectSlugs } from "@/lib/content/display";
import { loadOwnerData } from "@/lib/server/content-load";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import { mainGridAllowedLayoutIds } from "@/lib/site/grid";

export default function MainGrid({
  projectsSlugsPromise,
  layoutsPromise,
}: {
  projectsSlugsPromise: Promise<ProjectSlugs>;
  layoutsPromise: Promise<ResponsiveLayouts>;
}) {
  const projectsSlugs = use(projectsSlugsPromise);
  const layouts = use(layoutsPromise);
  const ownerData = loadOwnerData();
  const allowedLayoutIds = mainGridAllowedLayoutIds(projectsSlugs);

  return (
    <GridContainer
      layouts={layouts}
      layoutKey={MAIN_LAYOUTS_KEY}
      allowedLayoutIds={allowedLayoutIds}
    >
      <Card variant="item" key="me">
        <AboutMe />
      </Card>
      <Card variant="item" key="toggle-theme">
        <ThemeToggle />
      </Card>
      <Card variant="item" key="skills">
        <SkillsCard />
      </Card>
      <Card variant="item" key="maps">
        <Map.Root>
          <Map.Tiles />
          <Map.ZoomControls />
          <AvatarMarker
            markerRootId={AVATAR_MARKER_ROOT_ID}
            tooltip={ownerData.avatarMarkerTooltip}
          />
        </Map.Root>
      </Card>
      <Card variant="item" key="contributions" className="flex flex-col">
        <Suspense fallback={<Skeleton className="size-full" />}>
          <ContributionsCard />
        </Suspense>
      </Card>
      {projectsSlugs.map((projectSlug) => (
        <Card variant="item" key={projectSlug}>
          <ProjectCard projectSlug={projectSlug} />
        </Card>
      ))}
    </GridContainer>
  );
}
