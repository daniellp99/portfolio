import type { Metadata } from "next";

import { renderAboutMeCached } from "@/lib/content/render-about-me";

import { brandTitle } from "./brand";
import {
  openGraphArticleFragment,
  openGraphWebsiteFragment,
  twitterSummaryLargeImage,
} from "./fragments";
import { OWNER_AVATAR_PATH } from "@/content/owner-assets";

import { getCanonicalUrl, getHomeOgImageUrl, getMetadataBase } from "./urls";

type OwnerForMetadata = {
  name?: string | null;
  aboutMe?: string | null;
  journeyStartAt?: string | null;
  githubUser?: string | null;
};

async function resolveOwnerDescription(
  owner: OwnerForMetadata | null | undefined,
): Promise<string> {
  if (!owner?.aboutMe) return "";

  return renderAboutMeCached({
    aboutMe: owner.aboutMe,
    name: owner.name ?? "",
    journeyStartAt: owner.journeyStartAt ?? "",
  });
}

export async function buildRootLayoutMetadata(
  owner: OwnerForMetadata | null | undefined,
): Promise<Metadata> {
  const ownerName = owner?.name || "";
  const brand = brandTitle(ownerName);
  const description = await resolveOwnerDescription(owner);
  const avatarPath = OWNER_AVATAR_PATH;
  const homeUrl = getCanonicalUrl("");
  const homeOgImageUrl = getHomeOgImageUrl(owner?.journeyStartAt);

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
      imageUrl: homeOgImageUrl,
    }),
    twitter: twitterSummaryLargeImage({
      title: brand,
      description,
      imageUrl: homeOgImageUrl,
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

export async function buildHomeMetadata(
  owner: OwnerForMetadata | null | undefined,
): Promise<
  Pick<Metadata, "description" | "alternates" | "openGraph" | "twitter">
> {
  const ownerName = owner?.name || "";
  const brand = brandTitle(ownerName);
  const description = await resolveOwnerDescription(owner);
  const homeUrl = getCanonicalUrl("");
  const homeOgImageUrl = getHomeOgImageUrl(owner?.journeyStartAt);

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
      imageUrl: homeOgImageUrl,
    }),
    twitter: twitterSummaryLargeImage({
      title: brand,
      description,
      imageUrl: homeOgImageUrl,
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
