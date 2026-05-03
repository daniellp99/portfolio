import { Metadata } from "next";
import { Suspense, ViewTransition } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import DirectionalTransition from "@/components/DirectionalTransition";
import { CustomMDX } from "@/components/MdxRemote";
import ImageGrid from "@/components/server/ImageGrid";
import ProjectJsonLd from "@/components/server/ProjectJsonLd";

import { getOwnerData } from "@/lib/server/owner";
import { getProjectDetails, getProjectSlugs } from "@/lib/server/projects";
import { buildProjectPageMetadata } from "@/lib/site/metadata";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const project = await getProjectDetails(params.slug);
  const ownerData = await getOwnerData();

  return buildProjectPageMetadata({
    slug: params.slug,
    projectName: project.name,
    projectDescription: project.description,
    owner: ownerData ?? undefined,
  });
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();

  return [...slugs.map((slug) => ({ slug: slug }))];
}

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = await getProjectDetails(slug);

  return (
    <DirectionalTransition>
      <ProjectJsonLd slug={slug} />
      <div className="flex flex-col place-items-center gap-10">
        <article className="container mx-auto flex size-full flex-col gap-4 sm:flex-row">
          <section className="flex w-full flex-col space-y-4">
            <ViewTransition
              name={`project-title-${slug}`}
              share="text-morph"
              default="none"
            >
              <h1 className="font-sans text-6xl font-bold tracking-tight">
                {project.name}
              </h1>
            </ViewTransition>
            <p className="text-4xl text-pretty">{project.description}</p>
          </section>
          <section className="prose size-full max-w-none prose-zinc lg:prose-xl dark:prose-invert">
            <Suspense
              fallback={
                <ViewTransition exit="slide-down">
                  <Skeleton className="size-full" />
                </ViewTransition>
              }
            >
              <ViewTransition enter="slide-up" default="none">
                <CustomMDX source={project.content} />
              </ViewTransition>
            </Suspense>
          </section>
        </article>
        <section className="mx-auto size-full max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
          <Suspense
            fallback={
              <ViewTransition exit="slide-down">
                <Skeleton className="size-full" />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              <ImageGrid slug={slug} images={project.images} />
            </ViewTransition>
          </Suspense>
        </section>
      </div>
    </DirectionalTransition>
  );
}
