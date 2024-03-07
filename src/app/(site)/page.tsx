import GridContainer from "@/components/GridContainer";
import { generateDefaultLayouts } from "@/data/grid-layouts";
import { getProjectsDTO } from "@/data/project-dto";
import { reader } from "@/lib/reader";

export default async function Home() {
  const ownerData = await reader.singletons.ownerData.read();
  const projects = await getProjectsDTO();
  const layouts = await generateDefaultLayouts();
  return (
    <main className="mx-auto block max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
      <GridContainer
        ownerData={ownerData}
        projects={projects}
        layouts={layouts}
      />
    </main>
  );
}
