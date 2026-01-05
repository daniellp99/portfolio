"use client";
import dynamic from "next/dynamic";
import { use } from "react";
import { ResponsiveLayouts } from "react-grid-layout/react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import AboutMe from "@/components/AboutMe";
import GithubCard from "@/components/GithubCard";
import GridContainer from "@/components/GridContainer";
import ProjectCard from "@/components/ProjectCard";
import ThemeToggle from "@/components/ThemeToggle";

import { OwnerData, Project } from "@/data/project-dto";

const DynamicMap = dynamic(() => import("@/components/Map"), {
  loading: () => <Skeleton className="size-full" />,
  ssr: false,
});

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

export default function MainGrid({
  ownerDataAndProjectsPromises,
  layoutPromise,
}: {
  ownerDataAndProjectsPromises: Promise<[OwnerData, Project[]]>;
  layoutPromise: Promise<ResponsiveLayouts>;
}) {
  const [ownerData, projects] = use(ownerDataAndProjectsPromises);
  const layouts = use(layoutPromise);

  return (
    <GridContainer layouts={layouts}>
      <Card variant="item" key="me">
        <AboutMe name={ownerData?.name} description={ownerData?.aboutMe} />
      </Card>
      <Card variant="item" key="toggle-theme">
        <ThemeToggle />
      </Card>
      <Card variant="item" key="maps">
        <DynamicMap />
      </Card>
      <Card variant="item" key="social-links">
        <GithubCard githubUser={ownerData?.githubUser} />
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
