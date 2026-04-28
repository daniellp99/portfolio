import "server-only";

import { notFound } from "next/navigation";

import { readOwnerData } from "@/lib/content/owner";
import {
  listProjectSlugs,
  readAllProjectSummaries,
  readProject,
} from "@/lib/content/projects";

export async function getProjectSlugsDTO() {
  try {
    return await listProjectSlugs();
  } catch (error) {
    console.error("Failed to fetch project slugs in DTO:", error);
    return [];
  }
}

export async function getProjectsDTO() {
  try {
    return await readAllProjectSummaries();
  } catch (error) {
    console.error("Failed to fetch projects in DTO:", error);
    return [];
  }
}

export async function getProjectDetailsDTO(slug: string) {
  let project;
  try {
    project = await readProject(slug);
  } catch (error) {
    console.error("Failed to fetch project details in DTO:", error);
    notFound();
  }

  if (!project) {
    notFound();
  }

  return project;
}

export async function getOwnerDataDTO() {
  try {
    return await readOwnerData();
  } catch (error) {
    console.warn("Failed to fetch owner data in DTO:", error);
    return null;
  }
}

export async function getMapMarkerInfoDTO() {
  const ownerData = await getOwnerDataDTO();
  if (!ownerData) {
    return null;
  }
  return {
    avatarMarker: ownerData.avatarMarker,
    avatarMarkerHover: ownerData.avatarMarkerHover,
    avatarMarkerTooltip: ownerData.avatarMarkerTooltip,
  };
}

export type Project = Awaited<ReturnType<typeof getProjectsDTO>>[number];
export type Images = Awaited<ReturnType<typeof getProjectDetailsDTO>>["images"];
export type ProjectSlugs = Awaited<ReturnType<typeof getProjectSlugsDTO>>;
export type MapMarkerInfo = Awaited<ReturnType<typeof getMapMarkerInfoDTO>>;
