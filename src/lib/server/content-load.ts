import "server-only";

import { notFound } from "next/navigation";

import { readOwnerData } from "@/lib/content/owner";
import {
  listProjectSlugs,
  readAllProjectSummaries,
  readProject,
} from "@/lib/content/projects";
import { mapOwnerToMapMarkerInfo } from "@/lib/content/map-marker";
import type { MapMarkerInfo, OwnerData } from "@/lib/content/schemas";

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
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function loadProjectDetails(slug: string) {
  let project;
  try {
    project = await readProject(slug);
  } catch (error) {
    console.error("Failed to fetch project details:", error);
    notFound();
  }

  if (!project) {
    notFound();
  }

  return project;
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
