import "server-only";

import { notFound } from "next/navigation";
import { cache } from "react";

import { readOwnerData } from "@/lib/content/owner";
import {
  listProjectSlugs,
  readAllProjectSummaries,
  readProject,
} from "@/lib/content/projects";
import { cacheLife, cacheTag } from "next/cache";

export const getProjectSlugsDTO = cache(async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("project_slugs");

  try {
    return await listProjectSlugs();
  } catch (error) {
    console.error("Failed to fetch project slugs in DTO:", error);
    return [];
  }
});

export const getProjectsDTO = cache(async () => {
  try {
    return await readAllProjectSummaries();
  } catch (error) {
    console.error("Failed to fetch projects in DTO:", error);
    return [];
  }
});

export const getProjectDetailsDTO = cache(async (slug: string) => {
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
});

export const getOwnerDataDTO = cache(async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("owner_data");
  try {
    return await readOwnerData();
  } catch (error) {
    console.warn("Failed to fetch owner data in DTO:", error);
    return null;
  }
});

export const getMapMarkerInfoDTO = cache(async () => {
  const ownerData = await getOwnerDataDTO();
  if (!ownerData) {
    return null;
  }
  return {
    avatarMarker: ownerData.avatarMarker,
    avatarMarkerHover: ownerData.avatarMarkerHover,
    avatarMarkerTooltip: ownerData.avatarMarkerTooltip,
  };
});

export type Project = Awaited<ReturnType<typeof getProjectsDTO>>[number];
export type Images = Awaited<ReturnType<typeof getProjectDetailsDTO>>["images"];
export type OwnerData = Awaited<ReturnType<typeof getOwnerDataDTO>>;
export type ProjectSlugs = Awaited<ReturnType<typeof getProjectSlugsDTO>>;
export type MapMarkerInfo = Awaited<ReturnType<typeof getMapMarkerInfoDTO>>;
