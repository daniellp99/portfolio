import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import AboutMe from "@/components/AboutMe";
import GithubCard from "@/components/GithubCard";
import GridContainer from "@/components/GridContainer";
import Map from "@/components/Map";
import ProjectCard from "@/components/ProjectCard";
import ThemeToggle from "@/components/ThemeToggle";

import { getLayouts } from "@/server/layouts";
import { getMapMarkerInfo } from "@/server/owner";
import { getProjects } from "@/server/projects";
import { MAIN_LAYOUTS_KEY } from "@/utils/constants";

export function MainGridFallback() {
  return (
    <div className="mx-auto grid max-w-[375px] grid-cols-2 gap-[15.5px] p-[15.5px] md:max-w-[800px] md:grid-cols-4 md:gap-4 xl:max-w-[1200px]">
      <Skeleton className="col-span-full row-span-full h-86 sm:col-span-2 sm:row-span-2 sm:h-94 xl:row-auto xl:h-69" />
      <Skeleton className="col-span-2 h-40 sm:col-auto sm:h-45 xl:h-69" />
      <Skeleton className="row-span-2 h-full" />
      <Skeleton className="h-40 sm:h-45 xl:h-69" />
      <Skeleton className="-col-end-1 h-40 sm:h-45 xl:h-69" />
    </div>
  );
}

export default async function MainGrid() {
  const projects = await getProjects();
  const layouts = await getLayouts({ layoutKey: MAIN_LAYOUTS_KEY });
  const mapMarkerInfoPromise = getMapMarkerInfo();
  return (
    <GridContainer layouts={layouts} layoutKey={MAIN_LAYOUTS_KEY}>
      <Card variant="item" key="me">
        <AboutMe />
      </Card>
      <Card variant="item" key="toggle-theme">
        <ThemeToggle />
      </Card>
      <Card variant="item" key="maps">
        <Map mapMarkerInfoPromise={mapMarkerInfoPromise} />
      </Card>
      <Card variant="item" key="social-links">
        <GithubCard />
      </Card>
      {projects.map((project, index) => (
        <Card variant="item" key={project.slug}>
          <ProjectCard
            project={project}
            isHorizontal={index === 1 ? true : false}
          />
        </Card>
      ))}
    </GridContainer>
  );
}
