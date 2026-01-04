import { Metadata } from "next";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import GoBackButton from "@/components/GoBackButton";
import { CustomMDX } from "@/components/MdxRemote";

import ImageGrid from "@/components/ImageGrid";
import {
  getOwnerDataDTO,
  getProjectDetailsDTO,
  getProjectSlugsDTO,
} from "@/data/project-dto";
import { generateImageLayouts } from "@/utils/layout";
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
  const params = await props.params;
  const project = await getProjectDetailsDTO(params.slug);
  const ownerData = await getOwnerDataDTO();
  const layouts = generateImageLayouts(project.images);

  const ownerName = ownerData?.name || "Daniel";
  const projectUrl = getCanonicalUrl(`/project/${params.slug}`);
  // Ensure coverImage path has leading slash for consistency
  const coverImagePath = project.coverImage
    ? project.coverImage.startsWith("/")
      ? project.coverImage
      : `/${project.coverImage}`
    : "/LightLogo.svg";
  const projectImage = getAbsoluteImageUrl(coverImagePath);

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description:
      project.description || `${project.name} - A project by ${ownerName}`,
    image: projectImage,
    url: projectUrl,
    author: {
      "@type": "Person",
      name: ownerName,
    },
    ...(project.status && {
      creativeWorkStatus: project.status,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <ImageGrid layouts={layouts} images={project.images} />
        </section>
      </div>
    </>
  );
}
