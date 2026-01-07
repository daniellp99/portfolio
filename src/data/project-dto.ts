import "server-only";

import { notFound } from "next/navigation";
import { cache } from "react";

import { reader } from "@/lib/reader";

export const getProjectSlugsDTO = cache(async () => {
  try {
    return await reader.collections.projects.list();
  } catch (error) {
    console.error("Failed to fetch project slugs in DTO:", error);
    return [];
  }
});

export const getProjectsDTO = cache(async () => {
  try {
    const projects = (await reader.collections.projects.all()).map(
      (project) => {
        return {
          slug: project.slug,
          name: project.entry.name,
          coverImage: project.entry.coverImage,
          bgImage: project.entry.bgImage,
        };
      },
    );

    return projects;
  } catch (error) {
    console.error("Failed to fetch projects in DTO:", error);
    return [];
  }
});

export const getProjectDetailsDTO = cache(async (slug: string) => {
  try {
    const project = await reader.collections.projects.read(slug, {
      resolveLinkedFiles: true,
    });

    if (!project) {
      notFound();
    }

    return project;
  } catch (error) {
    console.error("Failed to fetch project details in DTO:", error);
    notFound();
  }
});

export const getOwnerDataDTO = cache(async () => {
  let ownerData;
  try {
    ownerData = await reader.singletons.ownerData.read();
  } catch (error) {
    console.warn("Failed to fetch owner data in DTO:", error);
    ownerData = null;
  }
  return ownerData;
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
