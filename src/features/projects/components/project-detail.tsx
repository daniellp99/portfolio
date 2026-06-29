import { Suspense, ViewTransition } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { CustomMDX } from "@/features/projects/components/mdx-remote";
import { ImageGrid } from "@/features/projects/components/image-grid";
import PostHogProjectView from "@/features/projects/components/posthog-project-view";
import { ProjectJsonLd } from "@/features/projects/components/project-json-ld";
import { getProjectDetails } from "@/features/projects/projects-queries";

const proseSectionClassName =
  "prose size-full max-w-none prose-zinc lg:prose-xl dark:prose-invert";

function LineSkeleton({
  className,
  widthClass = "w-full",
}: {
  className?: string;
  widthClass?: string;
}) {
  return (
    <Skeleton
      as="span"
      className={cn(
        "inline-block h-lh w-full align-text-bottom",
        widthClass,
        className,
      )}
    />
  );
}

function ProjectTitleSkeleton() {
  return (
    <h1 className="font-sans text-6xl font-bold tracking-tight">
      <LineSkeleton widthClass="w-2/5 max-w-xs" />
    </h1>
  );
}

function ProjectDescriptionSkeleton() {
  return (
    <p className="text-4xl text-pretty">
      <LineSkeleton />
      <br />
      <LineSkeleton />
      <br />
      <LineSkeleton widthClass="w-4/5" />
      <br />
      <LineSkeleton widthClass="w-3/5" />
    </p>
  );
}

function ProjectMdxSkeleton() {
  return (
    <>
      <h2>
        <LineSkeleton widthClass="w-20" />
      </h2>
      <p>
        <LineSkeleton />
        <br />
        <LineSkeleton />
        <br />
        <LineSkeleton widthClass="w-4/5" />
      </p>
      <h2>
        <LineSkeleton widthClass="w-24" />
      </h2>
      <ul>
        <li>
          <LineSkeleton />
        </li>
        <li>
          <LineSkeleton widthClass="w-11/12" />
        </li>
        <li>
          <LineSkeleton />
        </li>
        <li>
          <LineSkeleton widthClass="w-10/12" />
        </li>
        <li>
          <LineSkeleton widthClass="w-9/12" />
        </li>
      </ul>
    </>
  );
}

function ProjectImageGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-[15.5px] md:grid-cols-4 md:gap-4">
      <Skeleton className="col-span-2 h-52 rounded-xl md:col-span-3 md:h-64" />
      <Skeleton className="h-52 rounded-xl md:row-span-2 md:h-full md:min-h-64" />
      <Skeleton className="h-36 rounded-xl md:h-40" />
      <Skeleton className="col-span-2 h-52 rounded-xl md:col-span-3 md:h-64" />
      <Skeleton className="h-36 rounded-xl md:h-40" />
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
          <section className={proseSectionClassName}>
            <Suspense
              fallback={
                <ViewTransition exit="slide-down">
                  <ProjectMdxSkeleton />
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
                <ProjectImageGridSkeleton />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              <ImageGrid slug={slug} images={project.images} />
            </ViewTransition>
          </Suspense>
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
        <section className={proseSectionClassName}>
          <ProjectMdxSkeleton />
        </section>
      </article>
      <section className="mx-auto size-full max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
        <ProjectImageGridSkeleton />
      </section>
    </div>
  );
}
