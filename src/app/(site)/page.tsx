import GridContainer from "@/components/GridContainer";
import { generateLayouts } from "@/data/grid-layouts";
import { getProjectsDTO } from "@/data/project-dto";
import { reader } from "@/lib/reader";

export default async function Home() {
  const socialLinks = await reader.singletons.socialLinks.read();
  const projects = await getProjectsDTO();
  const layouts = await generateLayouts();
  return (
    <main className="mx-auto block max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]">
      <GridContainer
        links={socialLinks}
        projects={projects}
        layouts={layouts}
      />
    </main>
  );
}
