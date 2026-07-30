import { Metadata } from "next";

import DirectionalTransition from "@/components/DirectionalTransition";
import { SlideSuspense } from "@/components/SlideSuspense";
import { getOwnerData } from "@/features/owner/owner-queries";
import {
  ProjectDetail,
  ProjectDetailSkeleton,
} from "@/features/projects/components/project-detail";
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
      <SlideSuspense fallback={<ProjectDetailSkeleton />}>
        {props.params.then(({ slug }) => (
          <ProjectDetail slug={slug} />
        ))}
      </SlideSuspense>
    </DirectionalTransition>
  );
}
