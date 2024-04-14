import "server-only";

import { reader } from "@/lib/reader";

export async function getProjectSlugsDTO() {
  const projects = await reader.collections.projects.list();

  return projects;
}
export async function getProjectsDTO() {
  const projects = (await reader.collections.projects.all()).map((project) => {
    return {
      slug: project.slug,
      name: project.entry.name,
      coverImage: project.entry.coverImage,
      bgImage: project.entry.bgImage,
    };
  });

  return projects;
}

export type Project = Awaited<ReturnType<typeof getProjectsDTO>>[number];
