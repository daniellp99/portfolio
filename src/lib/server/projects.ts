"use server";

import {
  getProjectDetailsDTO,
  getProjectsDTO,
  getProjectSlugsDTO,
} from "@/lib/server/project-dto";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

export const getProjectDetails = cache(async (slug: string) => {
  "use cache";
  cacheLife("hours");
  cacheTag("project_details", `project_${slug}`);
  return await getProjectDetailsDTO(slug);
});

export const getProjects = cache(async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");
  return await getProjectsDTO();
});

export const getProjectSlugs = cache(async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("project_slugs");
  return await getProjectSlugsDTO();
});
