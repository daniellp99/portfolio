import { LoaderSkeleton } from "@/components/animations/skeleton";
import { Card } from "@/components/ui/card";

import AboutMe from "@/components/AboutMe";
import GithubCard from "@/components/GithubCard";
import GridContainer from "@/components/GridContainer";
import Map from "@/components/Map";
import ProjectCard from "@/components/ProjectCard";
import SkillsCard from "@/components/SkillsCard";
import ThemeToggle from "@/components/ThemeToggle";

import { MapMarkerInfo, Project } from "@/lib/server/project-dto";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import { use } from "react";
import { ResponsiveLayouts } from "react-grid-layout";

export function MainGridFallback() {
  return (
    <div className="mx-auto grid max-w-[375px] grid-cols-2 gap-[15.5px] p-[15.5px] md:max-w-[800px] md:grid-cols-4 md:gap-4 xl:max-w-[1200px]">
      <LoaderSkeleton className="col-span-full row-span-full h-86 sm:col-span-2 sm:row-span-2 sm:h-94 xl:row-auto xl:h-69" />
      <LoaderSkeleton className="col-span-2 h-40 sm:col-auto sm:h-45 xl:h-69" />
      <LoaderSkeleton className="row-span-2 h-full" />
      <LoaderSkeleton className="h-40 sm:h-45 xl:h-69" />
      <LoaderSkeleton className="h-40 sm:h-45 xl:h-69" />
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
  mapMarkerInfoPromise: Promise<MapMarkerInfo>;
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
      <Card variant="item" key="maps">
        <Map mapMarkerInfoPromise={mapMarkerInfoPromise} />
      </Card>
      <Card variant="item" key="social-links">
        <GithubCard />
      </Card>
      {projects.map((project, index) => (
        <Card variant="item" key={project.slug}>
          <ProjectCard project={project} eager={index < 3} />
        </Card>
      ))}
    </GridContainer>
  );
}
