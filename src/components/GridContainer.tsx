"use client";

import dynamic from "next/dynamic";
import { Layouts, Responsive, WidthProvider } from "react-grid-layout";

import { SocialLinks } from "@/types/socialLinks";
import SocialLinksContainer from "./SocialLinkContainer";
import ThemeToggle from "./ThemeToggle";
import ProjectCard from "./ProjectCard";
import { Project } from "@/data/project-dto";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DynamicMap = dynamic(() => import("@/components/Map"), {
  loading: () => (
    <div className="h-full w-full animate-pulse bg-zinc-200 dark:bg-zinc-600" />
  ),
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
      className="layout animate-fade-in"
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
      <div className="grid-item-container" key="me">
        <p>Me</p>
      </div>
      <div className="grid-item-container" key="toggle-theme">
        <ThemeToggle />
      </div>
      <div className="grid-item-container" key="maps">
        <DynamicMap />
      </div>
      <div className="grid-item-container" key="social-links">
        <SocialLinksContainer links={links} />
      </div>
      {projects.map((project, index) => (
        <div className="grid-item-container" key={project.slug}>
          <ProjectCard
            project={project}
            isHorizontal={index === 1 ? true : false}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
