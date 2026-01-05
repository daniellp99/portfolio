import { Metadata } from "next";
import { Suspense } from "react";

import MainGrid, { MainGridFallback } from "@/components/MainGrid";
import NavBar from "@/components/NavBar";

import { getLayouts } from "@/server/layouts";
import { getOwnerData } from "@/server/owner";
import { getProjects } from "@/server/projects";
import { getAbsoluteImageUrl, getCanonicalUrl } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = await getOwnerData();
  const ownerName = ownerData?.name || "";
  const title = ownerName ? `${ownerName}'s Portfolio` : "Portfolio";
  const description = ownerData?.aboutMe || "";
  const homeUrl = getCanonicalUrl("");
  const ogImage = getAbsoluteImageUrl("/Avatar.webp");

  return {
    description,
    alternates: {
      canonical: homeUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: homeUrl,
      siteName: `${ownerName}'s Portfolio`,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Home() {
  const ownerDataAndProjectsPromises = Promise.all([
    getOwnerData(),
    getProjects(),
  ]);
  const layoutPromise = getLayouts();

  const ownerData = await getOwnerData();
  const ownerName = ownerData?.name || "Portfolio Owner";
  const homeUrl = getCanonicalUrl("");
  const profileImage = getAbsoluteImageUrl("/Avatar.webp");

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: ownerName,
    description: ownerData?.aboutMe || `${ownerName}'s Portfolio`,
    url: homeUrl,
    image: profileImage,
    ...(ownerData?.githubUser && {
      sameAs: [`https://github.com/${ownerData.githubUser}`],
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar />
      <section className="mx-auto block max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
        <Suspense fallback={<MainGridFallback />}>
          <MainGrid
            ownerDataAndProjectsPromises={ownerDataAndProjectsPromises}
            layoutPromise={layoutPromise}
          />
        </Suspense>
      </section>
    </>
  );
}
