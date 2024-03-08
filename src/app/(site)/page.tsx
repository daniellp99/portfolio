import GridContainer from "@/components/GridContainer";
import { LayoutsContextProvider } from "@/components/LayoutsContext";
import NavBar from "@/components/NavBar";

import { generateLayouts } from "@/actions";
import { getProjectsDTO } from "@/data/project-dto";
import { reader } from "@/lib/reader";

export default async function Home() {
  const ownerData = await reader.singletons.ownerData.read();
  const projects = await getProjectsDTO();
  const defaultLayouts = await generateLayouts("All");

  return (
    <LayoutsContextProvider defaultLayouts={defaultLayouts}>
      <NavBar />
      <section className="mx-auto block max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
        <GridContainer ownerData={ownerData} projects={projects} />
      </section>
    </LayoutsContextProvider>
  );
}
