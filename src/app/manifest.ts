import type { MetadataRoute } from "next";

import { OWNER_AVATAR_PATH } from "@/content/owner-assets";
import { getOwnerData } from "@/features/owner/owner-queries";
import { renderAboutMeCached } from "@/lib/content/render-about-me";
import { brandTitle } from "@/lib/site/metadata/brand";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const owner = getOwnerData();
  const name = brandTitle(owner.name);
  const description =
    (await renderAboutMeCached({
      aboutMe: owner.aboutMe,
      name: owner.name,
      journeyStartAt: owner.journeyStartAt,
    })) || name;

  return {
    name,
    short_name: owner.name || "Portfolio",
    description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: OWNER_AVATAR_PATH,
        sizes: "any",
        type: "image/webp",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
