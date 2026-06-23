import { Metadata } from "next";
import { Suspense, ViewTransition } from "react";

import DirectionalTransition from "@/components/DirectionalTransition";
import {
  ProjectDetail,
  ProjectDetailSkeleton,
} from "@/features/projects/components/project-detail";
import { getOwnerData } from "@/features/owner/owner-queries";
import {
  getProjectDetails,
  getProjectSlugs,
} from "@/features/projects/projects-queries";
import { buildProjectPageMetadata } from "@/lib/site/metadata";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const project = await getProjectDetails(params.slug);
  const ownerData = getOwnerData();

  return buildProjectPageMetadata({
    slug: params.slug,
    projectName: project.name,
    projectDescription: project.description,
    owner: ownerData,
  });
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();

  return [...slugs.map((slug) => ({ slug: slug }))];
}

export default function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <DirectionalTransition>
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <ProjectDetailSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" default="none">
          {props.params.then(({ slug }) => (
            <ProjectDetail slug={slug} />
          ))}
        </ViewTransition>
      </Suspense>
    </DirectionalTransition>
  );
}
