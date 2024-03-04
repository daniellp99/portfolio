"use client";

import dynamic from "next/dynamic";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Project } from "@/data/project-dto";
import { SocialLinks } from "@/types/socialLinks";
import ProjectCard from "./ProjectCard";
import SocialLinksContainer from "./SocialLinkContainer";
import ThemeToggle from "./ThemeToggle";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DynamicMap = dynamic(() => import("@/components/Map"), {
  loading: () => <Skeleton className="h-full w-full" />,
  ssr: false,
});

export default function GridContainer({
  links,
  projects,
  layouts,
}: {
  links: SocialLinks | null;
  projects: Project[];
  layouts: Layouts;
}) {
  return (
    <ResponsiveGridLayout
      draggableCancel=".cancelDrag"
      className="layout animate-in fade-in duration-1000"
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
        <p>Me</p>
      </Card>
      <Card variant="item" key="toggle-theme">
        <ThemeToggle />
      </Card>
      <Card variant="item" key="maps" className="overflow-hidden">
        <DynamicMap />
      </Card>
      <Card variant="item" key="social-links">
        <SocialLinksContainer links={links} />
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
