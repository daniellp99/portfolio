import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import GoBackButton from "@/components/GoBackButton";
import { CustomMDX } from "@/components/MdxRemote";

import ImageGrid from "@/components/ImageGrid";
import { getProjectDetailsDTO, getProjectSlugsDTO } from "@/data/project-dto";
import { generateImageLayouts } from "@/utils/layout";

export async function generateStaticParams() {
  const slugs = await getProjectSlugsDTO();

  return [...slugs.map((slug) => ({ slug: slug }))];
}

export default async function ProjectPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const project = await getProjectDetailsDTO(params.slug);
  const layouts = generateImageLayouts(project.images);

  return (
    <div className="flex flex-col place-items-center gap-10 pt-10">
      <GoBackButton />
      <article className="container mx-auto flex size-full flex-col gap-4 sm:flex-row">
        <section className="flex w-full flex-col space-y-4">
          <h1 className="font-sans text-6xl font-bold tracking-tight">
            {project.name}
          </h1>
          <p className="text-pretty text-4xl">{project.description}</p>
        </section>
        <section className="prose prose-zinc size-full max-w-none dark:prose-invert lg:prose-xl">
          <Suspense fallback={<Skeleton className="size-full" />}>
            <CustomMDX source={project.content} />
          </Suspense>
        </section>
      </article>
      <section className="mx-auto size-full max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
        <ImageGrid layouts={layouts} images={project.images} />
      </section>
    </div>
  );
}
