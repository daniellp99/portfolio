import "server-only";

import { notFound } from "next/navigation";
import { cache } from "react";

import { reader } from "@/lib/reader";

export const getProjectSlugsDTO = cache(async () => {
  return reader.collections.projects.list();
});

export const getProjectsDTO = cache(async () => {
  const projects = (await reader.collections.projects.all()).map((project) => {
    return {
      slug: project.slug,
      name: project.entry.name,
      coverImage: project.entry.coverImage,
      bgImage: project.entry.bgImage,
    };
  });

  return projects;
});

export const getProjectDetailsDTO = cache(async (slug: string) => {
  const project = await reader.collections.projects.read(slug, {
    resolveLinkedFiles: true,
  });

  if (!project) {
    notFound();
  }

  return project;
});

export const getOwnerDataDTO = cache(async () => {
  return reader.singletons.ownerData.read();
});

export type Project = Awaited<ReturnType<typeof getProjectsDTO>>[number];
export type Images = Awaited<ReturnType<typeof getProjectDetailsDTO>>["images"];
export type OwnerData = Awaited<ReturnType<typeof getOwnerDataDTO>>;
export type ProjectSlugs = Awaited<ReturnType<typeof getProjectSlugsDTO>>;
