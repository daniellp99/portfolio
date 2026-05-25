"use server";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import type { Project } from "@/lib/content/display";
import {
  loadProjectDetails,
  loadProjectSlugs,
  loadProjectSummary,
} from "@/lib/server/content-load";

export const getProjectDetails = cache(async (slug: string) => {
  "use cache";
  cacheLife("hours");
  cacheTag("project_details", `project_${slug}`);
  return await loadProjectDetails(slug);
});

export const getProjectSummary = cache(
  async (slug: string): Promise<Project> => {
    "use cache";
    cacheLife("hours");
    cacheTag("projects", `project_${slug}`);
    return await loadProjectSummary(slug);
  },
);

export const getProjectSlugs = cache(async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("project_slugs");
  return await loadProjectSlugs();
});
