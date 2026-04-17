import { getOwnerData } from "@/server/owner";
import {
  getAbsoluteImageUrl,
  getCanonicalUrl,
  getOwnerAvatarPath,
} from "@/utils/metadata";

export default async function HomeJsonLd() {
  const ownerData = await getOwnerData();
  const ownerName = ownerData?.name || "Portfolio Owner";
  const homeUrl = getCanonicalUrl("");
  const brandName = ownerName ? `${ownerName}'s Portfolio` : "Portfolio";
  const profileImage = getAbsoluteImageUrl(
    getOwnerAvatarPath(ownerData?.avatar),
  );

  const personId = `${homeUrl}#person`;
  const websiteId = `${homeUrl}#website`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: ownerName,
        description: ownerData?.aboutMe || brandName,
        url: homeUrl,
        image: profileImage,
        ...(ownerData?.githubUser && {
          sameAs: [`https://github.com/${ownerData.githubUser}`],
        }),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: homeUrl,
        name: brandName,
        description: ownerData?.aboutMe || brandName,
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
