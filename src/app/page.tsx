import { Metadata } from "next";
import { Suspense, ViewTransition } from "react";

import DirectionalTransition from "@/components/DirectionalTransition";
import HomeJsonLd from "@/components/server/HomeJsonLd";
import MainGrid, { MainGridFallback } from "@/components/server/MainGrid";

import { getOwnerData } from "@/lib/server/owner";
import { buildHomeMetadata } from "@/lib/site/metadata";
import { SearchParams } from "nuqs/server";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = await getOwnerData();
  return buildHomeMetadata(ownerData ?? undefined);
}

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
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
            <MainGrid searchParamsPromise={searchParams} />
          </ViewTransition>
        </Suspense>
      </section>
    </DirectionalTransition>
  );
}
