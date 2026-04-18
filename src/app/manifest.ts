import { MetadataRoute } from "next";

import { getOwnerDataDTO } from "@/lib/server/project-dto";
import { getOwnerAvatarPath } from "@/lib/site/metadata";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const ownerData = await getOwnerDataDTO();
  const ownerName = ownerData?.name || "Portfolio";

  return {
    name: `${ownerName}'s Portfolio`,
    short_name: ownerName,
    description: ownerData?.aboutMe || "Portfolio website",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: getOwnerAvatarPath(ownerData?.avatar),
        sizes: "any",
        type: "image/webp",
      },
    ],
  };
}
