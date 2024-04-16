import "server-only";

import { reader } from "@/lib/reader";
import { notFound } from "next/navigation";

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

export async function getProjectDetailsDTO(slug: string) {
  const project = await reader.collections.projects.read(slug, {
    resolveLinkedFiles: true,
  });

  if (!project) {
    notFound();
  }

  return project;
}

export type Project = Awaited<ReturnType<typeof getProjectsDTO>>[number];
export type Images = Awaited<ReturnType<typeof getProjectDetailsDTO>>["images"];
