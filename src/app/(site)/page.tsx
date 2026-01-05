import { Metadata } from "next";
import { Suspense } from "react";

import HomeJsonLd from "@/components/HomeJsonLd";
import MainGrid, { MainGridFallback } from "@/components/MainGrid";
import NavBar from "@/components/NavBar";

import { getOwnerDataDTO, getProjectsDTO } from "@/data/project-dto";
import { getLayouts } from "@/server/layouts";
import { MAIN_LAYOUTS_KEY } from "@/utils/constants";
import { getAbsoluteImageUrl, getCanonicalUrl } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = await getOwnerDataDTO();
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

export default function HomePage() {
  const ownerDataAndProjectsPromises = Promise.all([
    getOwnerDataDTO(),
    getProjectsDTO(),
  ]);
  const layoutPromise = getLayouts({ layoutKey: MAIN_LAYOUTS_KEY });

  return (
    <>
      <HomeJsonLd />
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
