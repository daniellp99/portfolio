import { Metadata } from "next";
import { Suspense } from "react";
import { ViewTransition } from "react";

import DirectionalTransition from "@/components/DirectionalTransition";
import HomeJsonLd from "@/components/HomeJsonLd";
import MainGrid, { MainGridFallback } from "@/components/MainGrid";

import { getLayouts } from "@/lib/server/layouts";
import { getMapMarkerInfo, getOwnerData } from "@/lib/server/owner";
import { getProjects } from "@/lib/server/projects";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import { getCanonicalUrl } from "@/lib/site/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = await getOwnerData();
  const ownerName = ownerData?.name || "";
  const title = ownerName ? `${ownerName}'s Portfolio` : "Portfolio";
  const description = ownerData?.aboutMe || "";
  const homeUrl = getCanonicalUrl("");

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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function HomePage() {
  const projectsPromise = getProjects();
  const layoutsPromise = getLayouts({ layoutKey: MAIN_LAYOUTS_KEY });
  const mapMarkerInfoPromise = getMapMarkerInfo();

  return (
    <DirectionalTransition>
      <HomeJsonLd />
      <section className="group/main mx-auto block max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
        <Suspense
          fallback={
            <ViewTransition exit="slide-down">
              <MainGridFallback />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" default="none">
            <MainGrid
              projectsPromise={projectsPromise}
              layoutsPromise={layoutsPromise}
              mapMarkerInfoPromise={mapMarkerInfoPromise}
            />
          </ViewTransition>
        </Suspense>
      </section>
    </DirectionalTransition>
  );
}
