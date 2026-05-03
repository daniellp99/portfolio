import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import AboutMe from "@/components/AboutMe";
import ContributionsCard from "@/components/ContributionsCard";
import GridContainer from "@/components/GridContainer";
import Map from "@/components/Map";
import ProjectCard from "@/components/ProjectCard";
import SkillsCard from "@/components/SkillsCard";
import ThemeToggle from "@/components/ThemeToggle";

import type { MapMarkerInfo, Project } from "@/lib/content/display";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import { Suspense, use } from "react";
import { ResponsiveLayouts } from "react-grid-layout";
import AvatarMarker, {
  AvatarMarkerIcon,
  AvatarMarkerSkeleton,
} from "./AvatarMarker";

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
  projectsPromise,
  layoutsPromise,
  mapMarkerInfoPromise,
}: {
  projectsPromise: Promise<Project[]>;
  layoutsPromise: Promise<ResponsiveLayouts>;
  mapMarkerInfoPromise: Promise<MapMarkerInfo | null>;
}) {
  const projects = use(projectsPromise);
  const layouts = use(layoutsPromise);

  return (
    <GridContainer layouts={layouts} layoutKey={MAIN_LAYOUTS_KEY}>
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
      {projects.map((project, index) => (
        <Card variant="item" key={project.slug}>
          <ProjectCard project={project} eager={index < 3} />
        </Card>
      ))}
    </GridContainer>
  );
}
