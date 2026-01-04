import { MetadataRoute } from "next";

import { getCanonicalUrl } from "@/utils/metadata";

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = getCanonicalUrl("/sitemap.xml");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/keystatic/"],
    },
    sitemap: sitemapUrl,
  };
}
