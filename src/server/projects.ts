"use server";

import {
  getProjectDetailsDTO,
  getProjectsDTO,
  getProjectSlugsDTO,
} from "@/data/project-dto";
import { cacheLife, cacheTag } from "next/cache";

export async function getProjectDetails(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("project_details", `project_${slug}`);
  return await getProjectDetailsDTO(slug);
}

export async function getProjects() {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");
  return await getProjectsDTO();
}

export async function getProjectSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag("project_slugs");
  return await getProjectSlugsDTO();
}
