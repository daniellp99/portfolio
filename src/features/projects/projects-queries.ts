import "server-only";

import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import type { Project } from "@/lib/content/display";
import {
  listProjectSlugs,
  readProject,
  readProjectSummary,
} from "@/lib/content/projects";
import {
  InvalidProjectFrontMatterError,
  type ReadProjectResult,
} from "@/lib/content/projects-read";
import type { ProjectDetails } from "@/lib/content/schemas";

async function loadProjectSlugs(): Promise<string[]> {
  try {
    return await listProjectSlugs();
  } catch (error) {
    console.error("Failed to fetch project slugs:", error);
    return [];
  }
}

async function loadProjectSummary(slug: string): Promise<Project> {
  try {
    const summary = await readProjectSummary(slug);
    if (!summary) notFound();
    return summary;
  } catch (error) {
    if (error instanceof InvalidProjectFrontMatterError) {
      throw error;
    }
    console.error("Failed to fetch project summary:", error);
    notFound();
  }
}

async function loadProjectDetails(slug: string): Promise<ProjectDetails> {
  let result: ReadProjectResult;
  try {
    result = await readProject(slug);
  } catch (error) {
    console.error("Failed to fetch project details:", error);
    notFound();
  }

  if (result.status === "missing") {
    notFound();
  }

  if (result.status === "invalid") {
    throw new InvalidProjectFrontMatterError(result.slug, result.cause);
  }

  return result.project;
}

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
