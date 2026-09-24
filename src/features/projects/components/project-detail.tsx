import { ViewTransition } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { SlideSuspense } from "@/components/SlideSuspense";

import { CustomMDX } from "@/features/projects/components/mdx-remote";
import { ImageGrid } from "@/features/projects/components/image-grid";
import PostHogProjectView from "@/features/projects/components/posthog-project-view";
import { ProjectJsonLd } from "@/features/projects/components/project-json-ld";
import { getProjectDetails } from "@/features/projects/projects-queries";

const typesetSectionClassName = "typeset typeset-docs max-w-[37em] size-full";

function ProjectTitleSkeleton() {
  return (
    <h1 className="font-sans text-6xl font-bold tracking-tight">
      <Skeleton
        as="span"
        className="inline-block h-lh w-2/5 max-w-xs align-text-bottom"
      />
    </h1>
  );
}

function ProjectDescriptionSkeleton() {
  return (
    <p className="text-4xl text-pretty">
      <Skeleton as="span" className="inline-block h-lh w-full align-text-bottom" />
      <br />
      <Skeleton as="span" className="inline-block h-lh w-full align-text-bottom" />
      <br />
      <Skeleton
        as="span"
        className="inline-block h-lh w-4/5 align-text-bottom"
      />
      <br />
      <Skeleton
        as="span"
        className="inline-block h-lh w-3/5 align-text-bottom"
      />
    </p>
  );
}

function ProjectMdxSkeleton() {
  return (
    <>
      <h2>
        <Skeleton
          as="span"
          className="inline-block h-lh w-20 align-text-bottom"
        />
      </h2>
      <p>
        <Skeleton as="span" className="inline-block h-lh w-full align-text-bottom" />
        <br />
        <Skeleton as="span" className="inline-block h-lh w-full align-text-bottom" />
        <br />
        <Skeleton
          as="span"
          className="inline-block h-lh w-4/5 align-text-bottom"
        />
      </p>
      <h2>
        <Skeleton
          as="span"
          className="inline-block h-lh w-24 align-text-bottom"
        />
      </h2>
      <ul>
        <li>
          <Skeleton
            as="span"
            className="inline-block h-lh w-full align-text-bottom"
          />
        </li>
        <li>
          <Skeleton
            as="span"
            className="inline-block h-lh w-11/12 align-text-bottom"
          />
        </li>
        <li>
          <Skeleton
            as="span"
            className="inline-block h-lh w-full align-text-bottom"
          />
        </li>
        <li>
          <Skeleton
            as="span"
            className="inline-block h-lh w-10/12 align-text-bottom"
          />
        </li>
        <li>
          <Skeleton
            as="span"
            className="inline-block h-lh w-9/12 align-text-bottom"
          />
        </li>
      </ul>
    </>
  );
}

function ProjectImageGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3.75 md:grid-cols-4 md:gap-4">
      <Skeleton
        variant="media"
        className="col-span-2 h-52 md:col-span-3 md:h-64"
      />
      <Skeleton variant="media" className="h-52 md:row-span-2 md:h-full md:min-h-64" />
      <Skeleton variant="media" className="h-36 md:h-40" />
      <Skeleton
        variant="media"
        className="col-span-2 h-52 md:col-span-3 md:h-64"
      />
      <Skeleton variant="media" className="h-36 md:h-40" />
    </div>
  );
}

export async function ProjectDetail({ slug }: { slug: string }) {
  const project = await getProjectDetails(slug);

  return (
    <>
      <PostHogProjectView slug={slug} projectName={project.name} />
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
          <section className={typesetSectionClassName}>
            <SlideSuspense fallback={<ProjectMdxSkeleton />}>
              <CustomMDX source={project.content} />
            </SlideSuspense>
          </section>
        </article>
        <section className="mx-auto size-full max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
          <SlideSuspense fallback={<ProjectImageGridSkeleton />}>
            <ImageGrid slug={slug} images={project.images} />
          </SlideSuspense>
        </section>
      </div>
    </>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="flex flex-col place-items-center gap-10">
      <article className="container mx-auto flex size-full flex-col gap-4 sm:flex-row">
        <section className="flex w-full flex-col space-y-4">
          <ProjectTitleSkeleton />
          <ProjectDescriptionSkeleton />
        </section>
        <section className={typesetSectionClassName}>
          <ProjectMdxSkeleton />
        </section>
      </article>
      <section className="mx-auto size-full max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
        <ProjectImageGridSkeleton />
      </section>
    </div>
  );
}
