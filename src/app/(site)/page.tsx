import GridContainer from "@/components/GridContainer";
import { generateDefaultLayouts } from "@/data/grid-layouts";
import { getProjectsDTO } from "@/data/project-dto";
import { reader } from "@/lib/reader";

export default async function Home() {
  const socialLinks = await reader.singletons.socialLinks.read();
  const projects = await getProjectsDTO();
  const layouts = await generateDefaultLayouts();
  return (
    <main className="mx-auto block w-[375px] md:w-[800px] xl:w-[1200px]">
      <GridContainer
        links={socialLinks}
        projects={projects}
        layouts={layouts}
      />
    </main>
  );
}
