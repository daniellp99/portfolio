import { MetadataRoute } from "next";

import { getProjectSlugs } from "@/lib/server/projects";
import { getCanonicalUrl } from "@/lib/site/metadata";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectSlugs();

  const projectUrls = projects.map((slug) => ({
    url: getCanonicalUrl(`/project/${slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: getCanonicalUrl(""),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projectUrls,
  ];
}
