import { Metadata } from "next";
import { Suspense, ViewTransition } from "react";

import DirectionalTransition from "@/components/DirectionalTransition";
import HomeJsonLd from "@/components/server/HomeJsonLd";
import MainGrid, { MainGridFallback } from "@/components/server/MainGrid";

import { loadOwnerData } from "@/lib/server/content-load";
import { getLayouts } from "@/lib/server/layouts";
import { getProjectSlugs } from "@/lib/server/projects";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import { buildHomeMetadata } from "@/lib/site/metadata";
import { getActiveTab } from "@/lib/site/tabs";
import { cookies } from "next/headers";

export function generateMetadata(): Metadata {
  const ownerData = loadOwnerData();

  return buildHomeMetadata(ownerData);
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const activeTab = getActiveTab(cookieStore);
  const projectsSlugsPromise = getProjectSlugs();
  const layoutsPromise = getLayouts(
    {
      layoutKey: MAIN_LAYOUTS_KEY,
    },
    cookieStore,
  );

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
              projectsSlugsPromise={projectsSlugsPromise}
              layoutsPromise={layoutsPromise}
              activeTab={activeTab}
            />
          </ViewTransition>
        </Suspense>
      </section>
    </DirectionalTransition>
  );
}
