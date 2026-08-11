import { MetadataRoute } from "next";

import { getProjectsForSitemap } from "@/features/projects/projects-queries";
import {
  getAbsoluteImageUrl,
  getCanonicalUrl,
} from "@/lib/site/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectsForSitemap();

  const newestProjectMtime = projects.reduce<Date | null>((latest, project) => {
    if (!latest || project.lastModified > latest) {
      return project.lastModified;
    }
    return latest;
  }, null);

  const projectUrls = projects.map((project) => {
    const coverPath = project.coverImage.startsWith("/")
      ? project.coverImage
      : `/${project.coverImage}`;

    return {
      url: getCanonicalUrl(`/project/${project.slug}`),
      lastModified: project.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [getAbsoluteImageUrl(coverPath)],
    };
  });

  return [
    {
      url: getCanonicalUrl(""),
      lastModified: newestProjectMtime ?? new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectUrls,
  ];
}
