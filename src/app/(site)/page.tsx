import GridContainer from "@/components/GridContainer";
import { generateLayouts } from "@/data/grid-layouts";
import { getProjectSlugsDTO } from "@/data/project-dto";
import { reader } from "@/lib/reader";

export default async function Home() {
  const socialLinks = await reader.singletons.socialLinks.read();
  const projectSlugs = await getProjectSlugsDTO();
  const layouts = await generateLayouts();
  return (
    <main className="mx-auto block w-[375px] md:w-[800px] xl:w-[1200px]">
      <GridContainer
        links={socialLinks}
        projects={projectSlugs}
        layouts={layouts}
      />
    </main>
  );
}
