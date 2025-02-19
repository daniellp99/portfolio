import { Suspense } from "react";

import { LayoutsContextProvider } from "@/components/LayoutsContext";
import MainGrid, { MainGridFallback } from "@/components/MainGrid";
import NavBar from "@/components/NavBar";

import {
  getOwnerDataDTO,
  getProjectSlugsDTO,
  getProjectsDTO,
} from "@/data/project-dto";
import { generateLayouts } from "@/utils/layout";

export default async function Home() {
  const ownerDataAndProjectsPromises = Promise.all([
    getOwnerDataDTO(),
    getProjectsDTO(),
  ]);

  const projectKeys = await getProjectSlugsDTO();
  const defaultLayouts = generateLayouts("All", projectKeys);

  return (
    <LayoutsContextProvider defaultLayouts={defaultLayouts}>
      <NavBar />
      <section className="mx-auto block max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
        <Suspense fallback={<MainGridFallback />}>
          <MainGrid
            ownerDataAndProjectsPromises={ownerDataAndProjectsPromises}
          />
        </Suspense>
      </section>
    </LayoutsContextProvider>
  );
}
