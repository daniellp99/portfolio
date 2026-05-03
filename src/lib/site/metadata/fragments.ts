import type { Metadata } from "next";

/** Shared Open Graph shape for marketing-style pages (home, root). */
export function openGraphWebsiteFragment(input: {
  url: string;
  siteName: string;
  title: string;
  description: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    locale: "en_US",
    url: input.url,
    siteName: input.siteName,
    title: input.title,
    description: input.description,
  };
}

/** Open Graph for a single project article. */
export function openGraphArticleFragment(input: {
  url: string;
  siteName: string;
  title: string;
  description: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "article",
    locale: "en_US",
    url: input.url,
    siteName: input.siteName,
    title: input.title,
    description: input.description,
  };
}

export function twitterSummaryLargeImage(input: {
  title: string;
  description: string;
  creator?: string;
}): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: input.title,
    description: input.description,
    ...(input.creator ? { creator: input.creator } : {}),
  };
}
