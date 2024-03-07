"use client";

import dynamic from "next/dynamic";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Project } from "@/data/project-dto";
import { OwnerData } from "@/types/ownerData";
import ProjectCard from "./ProjectCard";
import GithubCard from "./GithubCard";
import ThemeToggle from "./ThemeToggle";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DynamicMap = dynamic(() => import("@/components/Map"), {
  loading: () => <Skeleton className="h-full w-full" />,
  ssr: false,
});

export default function GridContainer({
  ownerData,
  projects,
  layouts,
}: {
  ownerData: OwnerData | null;
  projects: Project[];
  layouts: Layouts;
}) {
  return (
    <ResponsiveGridLayout
      draggableCancel=".cancelDrag"
      className="layout duration-1000 animate-in fade-in"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 4, md: 4, sm: 4, xs: 2, xxs: 2 }}
      rowHeight={164}
      containerPadding={{
        xxs: [15.5, 15.5],
        xs: [15.5, 15.5],
        sm: [16, 16],
        md: [16, 16],
      }}
      margin={{
        xxs: [15.5, 15.5],
        xs: [15.5, 15.5],
        sm: [16, 16],
        md: [16, 16],
      }}
      // isBounded={true}
    >
      <Card variant="item" key="me">
        <p>{ownerData?.aboutMe}</p>
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
    </ResponsiveGridLayout>
  );
}
