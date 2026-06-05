import { Metadata } from "next";

import DirectionalTransition from "@/components/DirectionalTransition";
import HomeJsonLd from "@/components/server/HomeJsonLd";

import MainGridLoader from "@/components/server/MainGridLoader";
import { loadOwnerData } from "@/lib/server/content-load";
import { MAIN_GRID_TABPANEL_ID } from "@/lib/site/constants";
import { buildHomeMetadata } from "@/lib/site/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const ownerData = loadOwnerData();

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
        className="group/main mx-auto block max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]"
      >
        <MainGridLoader />
      </section>
    </DirectionalTransition>
  );
}
