import "server-only";

import { notFound } from "next/navigation";

import { readOwnerData } from "@/lib/content/owner";
import {
  listProjectSlugs,
  readAllProjectSummaries,
  readProject,
} from "@/lib/content/projects";
import {
  InvalidProjectFrontMatterError,
  type ReadProjectResult,
} from "@/lib/content/projects-read";
import { mapOwnerToMapMarkerInfo } from "@/lib/content/map-marker";
import type { MapMarkerInfo } from "@/lib/content/display";
import type { OwnerData, ProjectDetails } from "@/lib/content/schemas";

export async function loadProjectSlugs(): Promise<string[]> {
  try {
    return await listProjectSlugs();
  } catch (error) {
    console.error("Failed to fetch project slugs:", error);
    return [];
  }
}

export async function loadProjects() {
  try {
    return await readAllProjectSummaries();
  } catch (error) {
    if (error instanceof InvalidProjectFrontMatterError) {
      throw error;
    }
    console.error("Failed to fetch projects:", error);
    return [];
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

export async function loadOwnerData(): Promise<OwnerData | null> {
  try {
    return await readOwnerData();
  } catch (error) {
    console.warn("Failed to fetch owner data:", error);
    return null;
  }
}

export async function loadMapMarkerInfo(): Promise<MapMarkerInfo | null> {
  const ownerData = await loadOwnerData();
  return mapOwnerToMapMarkerInfo(ownerData);
}
