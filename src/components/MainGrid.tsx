"use client";

import dynamic from "next/dynamic";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Project } from "@/data/project-dto";
import { OwnerData } from "@/types/ownerData";
import GithubCard from "./GithubCard";
import GridContainer from "./GridContainer";
import { LayoutsContext } from "./LayoutsContext";
import ProjectCard from "./ProjectCard";
import ThemeToggle from "./ThemeToggle";
import AboutMe from "./AboutMe";

const DynamicMap = dynamic(() => import("@/components/Map"), {
  loading: () => <Skeleton className="h-full w-full" />,
  ssr: false,
});

export default function MainGrid({
  ownerData,
  projects,
}: {
  ownerData: OwnerData | null;
  projects: Project[];
}) {
  const { layouts } = use(LayoutsContext);
  return (
    <GridContainer layouts={layouts}>
      <Card variant="item" key="me">
        <AboutMe name={ownerData?.name} description={ownerData?.aboutMe} />
      </Card>
      <Card variant="item" key="toggle-theme">
        <ThemeToggle />
      </Card>
      <Card variant="item" key="maps" className="overflow-hidden">
        <DynamicMap />
      </Card>
      <Card variant="item" key="social-links">
        <GithubCard githubUser={ownerData?.githubUser} />
      </Card>
      {projects.map((project, index) => (
        <Card variant="item" key={project.slug} className="overflow-hidden">
          <ProjectCard
            project={project}
            isHorizontal={index === 1 ? true : false}
          />
        </Card>
      ))}
    </GridContainer>
  );
}
