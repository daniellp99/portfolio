import { Suspense, use } from "react";
import { ResponsiveLayouts } from "react-grid-layout";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import AvatarMarker, {
  AvatarMarkerIcon,
  AvatarMarkerSkeleton,
} from "@/components/AvatarMarker";
import GridContainer from "@/components/GridContainer";
import Map from "@/components/Map";
import AboutMe from "@/components/server/AboutMe";
import ContributionsCard from "@/components/server/ContributionsCard";
import ProjectCard from "@/components/server/ProjectCard";
import SkillsCard from "@/components/server/SkillsCard";
import ThemeToggle from "@/components/ThemeToggle";

import type { MapMarkerInfo, ProjectSlugs } from "@/lib/content/display";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import { mainGridAllowedLayoutIds } from "@/lib/site/grid";

export function MainGridFallback() {
  return (
    <div className="mx-auto grid max-w-[375px] grid-cols-2 gap-[15.5px] p-[15.5px] md:max-w-[800px] md:grid-cols-4 md:gap-4 xl:max-w-[1200px]">
      <Skeleton className="col-span-full row-span-full h-86 sm:col-span-2 sm:row-span-2 sm:h-94 xl:row-auto xl:h-69" />
      <Skeleton className="col-span-2 h-40 sm:col-auto sm:h-45 xl:h-69" />
      <Skeleton className="row-span-2 h-full" />
      <Skeleton className="h-40 sm:h-45 xl:h-69" />
      <Skeleton className="h-40 sm:h-45 xl:h-69" />
    </div>
  );
}

export default function MainGrid({
  projectsSlugsPromise,
  layoutsPromise,
  mapMarkerInfoPromise,
}: {
  projectsSlugsPromise: Promise<ProjectSlugs>;
  layoutsPromise: Promise<ResponsiveLayouts>;
  mapMarkerInfoPromise: Promise<MapMarkerInfo | null>;
}) {
  const projectsSlugs = use(projectsSlugsPromise);
  const layouts = use(layoutsPromise);
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
      <Card variant="item" key="maps" className="relative">
        <Map>
          <AvatarMarker>
            <Suspense fallback={<AvatarMarkerSkeleton />}>
              <AvatarMarkerIcon mapMarkerInfoPromise={mapMarkerInfoPromise} />
            </Suspense>
          </AvatarMarker>
        </Map>
      </Card>
      <Card variant="item" key="contributions" className="flex flex-col">
        <ContributionsCard />
      </Card>
      {projectsSlugs.map((projectSlug) => (
        <Card variant="item" key={projectSlug}>
          <ProjectCard projectSlug={projectSlug} />
        </Card>
      ))}
    </GridContainer>
  );
}
