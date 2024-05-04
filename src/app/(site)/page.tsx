import { LayoutsContextProvider } from "@/components/LayoutsContext";
import MainGrid from "@/components/MainGrid";
import NavBar from "@/components/NavBar";

import { getProjectSlugsDTO, getProjectsDTO } from "@/data/project-dto";
import { reader } from "@/lib/reader";
import { generateLayouts } from "@/utils/layout";

export default async function Home() {
  const ownerData = await reader.singletons.ownerData.read();
  const projects = await getProjectsDTO();
  const projectKeys = await getProjectSlugsDTO();

  const defaultLayouts = generateLayouts("All", projectKeys);

  return (
    <LayoutsContextProvider defaultLayouts={defaultLayouts}>
      <NavBar projectKeys={projectKeys} />
      <section className="mx-auto block max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
        <MainGrid ownerData={ownerData} projects={projects} />
      </section>
    </LayoutsContextProvider>
  );
}
