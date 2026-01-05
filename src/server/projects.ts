"use server";

import {
  getProjectDetailsDTO,
  getProjectsDTO,
  getProjectSlugsDTO,
} from "@/data/project-dto";
import { cacheLife, cacheTag } from "next/cache";

export async function getProjects() {
  "use cache";
  cacheLife("weeks");
  cacheTag("projects");
  return await getProjectsDTO();
}

export async function getProjectDetails(slug: string) {
  "use cache";
  cacheLife("weeks");
  cacheTag("project_details", slug);
  return await getProjectDetailsDTO(slug);
}

export async function getProjectSlugs() {
  "use cache";
  cacheLife("weeks");
  cacheTag("project_slugs");
  return await getProjectSlugsDTO();
}
