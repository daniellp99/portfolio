import { MetadataRoute } from "next";

import { getOwnerData } from "@/server/owner";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const ownerData = await getOwnerData();
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
        src: "/Avatar.webp",
        sizes: "any",
        type: "image/webp",
      },
    ],
  };
}
