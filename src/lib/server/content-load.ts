import "server-only";

import { notFound } from "next/navigation";

import { rawOwnerData } from "@/content/owner-data";
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
import {
  ownerDataSchema,
  type OwnerData,
  type ProjectDetails,
} from "@/lib/content/schemas";

export async function loadProjectSlugs(): Promise<string[]> {
  try {
    return await listProjectSlugs();
  } catch (error) {
    console.error("Failed to fetch project slugs:", error);
    return [];
  }
}

export async function loadProjectSummary(slug: string): Promise<Project> {
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

export async function loadProjectDetails(
  slug: string,
): Promise<ProjectDetails> {
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

export function loadOwnerData(): OwnerData {
  const ownerData = ownerDataSchema.parse(rawOwnerData);
  return ownerData;
}
