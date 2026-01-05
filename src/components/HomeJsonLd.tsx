// src/components/JsonLd.tsx
import { getOwnerData } from "@/server/owner";
import { getAbsoluteImageUrl, getCanonicalUrl } from "@/utils/metadata";

export default async function HomeJsonLd() {
  const ownerData = await getOwnerData();
  const ownerName = ownerData?.name || "Portfolio Owner";
  const homeUrl = getCanonicalUrl("");
  const profileImage = getAbsoluteImageUrl("/Avatar.webp");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: ownerName,
    description: ownerData?.aboutMe || `${ownerName}'s Portfolio`,
    url: homeUrl,
    image: profileImage,
    ...(ownerData?.githubUser && {
      sameAs: [`https://github.com/${ownerData.githubUser}`],
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
