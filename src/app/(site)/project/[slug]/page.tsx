import { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import GoBackButton from "@/components/GoBackButton";
import { CustomMDX } from "@/components/MdxRemote";

import ImageGrid from "@/components/ImageGrid";
import ProjectJsonLd from "@/components/ProjectJsonLd";
import {
  getOwnerDataDTO,
  getProjectDetailsDTO,
  getProjectSlugsDTO,
} from "@/data/project-dto";
import { getProjectDetails } from "@/server/projects";
import { getAbsoluteImageUrl, getCanonicalUrl } from "@/utils/metadata";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const project = await getProjectDetailsDTO(params.slug);
  const ownerData = await getOwnerDataDTO();

  const title = project.name;
  const description = project.description;
  const ownerName = ownerData?.name || "";

  // Ensure coverImage path has leading slash
  const coverImagePath = project.coverImage.startsWith("/")
    ? project.coverImage
    : `/${project.coverImage}`;
  const ogImage = getAbsoluteImageUrl(coverImagePath);

  const projectUrl = getCanonicalUrl(`/project/${params.slug}`);

  return {
    title,
    description,
    keywords: [
      project.name,
      "web development",
      "project",
      "portfolio",
      "React",
      "Next.js",
    ],
    authors: [{ name: ownerName }],
    openGraph: {
      title,
      description,
      type: "article",
      locale: "en_US",
      url: projectUrl,
      siteName: `${ownerName}'s Portfolio`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      ...(ownerData?.githubUser && {
        creator: `@${ownerData.githubUser}`,
      }),
    },
    alternates: {
      canonical: projectUrl,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugsDTO();

  return [...slugs.map((slug) => ({ slug: slug }))];
}

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = await getProjectDetails(slug);

  return (
    <>
      <ProjectJsonLd slug={slug} />
      <div className="flex flex-col place-items-center gap-10 pt-10">
        <GoBackButton />
        <article className="container mx-auto flex size-full flex-col gap-4 sm:flex-row">
          <section className="flex w-full flex-col space-y-4">
            <h1 className="font-sans text-6xl font-bold tracking-tight">
              {project.name}
            </h1>
            <p className="text-4xl text-pretty">{project.description}</p>
          </section>
          <section className="prose size-full max-w-none prose-zinc lg:prose-xl dark:prose-invert">
            <Suspense fallback={<Skeleton className="size-full" />}>
              <CustomMDX source={project.content} />
            </Suspense>
          </section>
        </article>
        <section className="mx-auto size-full max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
          <Suspense fallback={<Skeleton className="size-full" />}>
            <ImageGrid images={project.images} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
