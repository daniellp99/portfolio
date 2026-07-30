import { Metadata } from "next";

import DirectionalTransition from "@/components/DirectionalTransition";
import { SlideSuspense } from "@/components/SlideSuspense";
import {
  MainGrid,
  MainGridSkeleton,
} from "@/features/home/components/main-grid";
import { HomeJsonLd } from "@/features/owner/components/home-json-ld";
import { getOwnerData } from "@/features/owner/owner-queries";
import { MAIN_GRID_TABPANEL_ID } from "@/lib/site/constants";
import { buildHomeMetadata } from "@/lib/site/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = getOwnerData();

  return buildHomeMetadata(ownerData);
}

export default function HomePage() {
  return (
    <DirectionalTransition>
      <HomeJsonLd />
      <section
        id={MAIN_GRID_TABPANEL_ID}
        role="tabpanel"
        aria-label="Portfolio grid"
        className="group/main mx-auto block max-w-93.75 md:max-w-200 xl:max-w-300"
      >
        <SlideSuspense fallback={<MainGridSkeleton />}>
          <MainGrid />
        </SlideSuspense>
      </section>
    </DirectionalTransition>
  );
}
