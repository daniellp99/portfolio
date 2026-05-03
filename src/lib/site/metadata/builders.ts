import type { Metadata } from "next";

import { brandTitle } from "./brand";
import {
  openGraphArticleFragment,
  openGraphWebsiteFragment,
  twitterSummaryLargeImage,
} from "./fragments";
import { getCanonicalUrl, getMetadataBase, getOwnerAvatarPath } from "./urls";

type OwnerForMetadata = {
  name?: string | null;
  aboutMe?: string | null;
  avatar?: string | null;
  githubUser?: string | null;
};

export function buildRootLayoutMetadata(
  owner: OwnerForMetadata | null | undefined,
): Metadata {
  const ownerName = owner?.name || "";
  const brand = brandTitle(ownerName);
  const description = owner?.aboutMe || "";
  const avatarPath = getOwnerAvatarPath(owner?.avatar);
  const homeUrl = getCanonicalUrl("");

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: brand,
      template: `%s | ${brand}`,
    },
    description,
    icons: {
      icon: avatarPath,
      apple: avatarPath,
    },
    keywords: [
      "web developer",
      "full-stack developer",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn UI",
      "AuthJS",
      "Drizzle ORM",
      "portfolio",
      ownerName,
      "Cuba",
    ],
    authors: [{ name: ownerName }],
    creator: ownerName,
    applicationName: brand,
    category: "Portfolio",
    alternates: {
      canonical: homeUrl,
    },
    openGraph: openGraphWebsiteFragment({
      url: homeUrl,
      siteName: brand,
      title: brand,
      description,
    }),
    twitter: twitterSummaryLargeImage({
      title: brand,
      description,
    }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function buildHomeMetadata(
  owner: OwnerForMetadata | null | undefined,
): Pick<Metadata, "description" | "alternates" | "openGraph" | "twitter"> {
  const ownerName = owner?.name || "";
  const brand = brandTitle(ownerName);
  const description = owner?.aboutMe || "";
  const homeUrl = getCanonicalUrl("");

  return {
    description,
    alternates: {
      canonical: homeUrl,
    },
    openGraph: openGraphWebsiteFragment({
      url: homeUrl,
      siteName: brand,
      title: brand,
      description,
    }),
    twitter: twitterSummaryLargeImage({
      title: brand,
      description,
    }),
  };
}

export function buildProjectPageMetadata(input: {
  slug: string;
  projectName: string;
  projectDescription: string;
  owner: OwnerForMetadata | null | undefined;
}): Pick<
  Metadata,
  | "title"
  | "description"
  | "keywords"
  | "authors"
  | "openGraph"
  | "twitter"
  | "alternates"
> {
  const { slug, projectName, projectDescription, owner } = input;
  const ownerName = owner?.name || "";
  const brand = brandTitle(ownerName);
  const projectUrl = getCanonicalUrl(`/project/${slug}`);

  return {
    title: projectName,
    description: projectDescription,
    keywords: [
      projectName,
      "web development",
      "project",
      "portfolio",
      "React",
      "Next.js",
    ],
    authors: [{ name: ownerName }],
    openGraph: openGraphArticleFragment({
      url: projectUrl,
      siteName: brand,
      title: projectName,
      description: projectDescription,
    }),
    twitter: twitterSummaryLargeImage({
      title: projectName,
      description: projectDescription,
      ...(owner?.githubUser ? { creator: `@${owner.githubUser}` } : {}),
    }),
    alternates: {
      canonical: projectUrl,
    },
  };
}
