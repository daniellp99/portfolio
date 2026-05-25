import { renderAboutMe } from "@/lib/content/render-about-me";
import { loadOwnerData } from "@/lib/server/content-load";
import {
  getAbsoluteImageUrl,
  getCanonicalUrl,
  getOwnerAvatarPath,
} from "@/lib/site/metadata";
import { serializeJsonLd } from "@/lib/json-ld";

export default function HomeJsonLd() {
  const ownerData = loadOwnerData();
  const ownerName = ownerData.name;
  const homeUrl = getCanonicalUrl("");
  const brandName = `${ownerName}'s Portfolio`;
  const description =
    renderAboutMe({
      aboutMe: ownerData.aboutMe,
      name: ownerData.name,
      journeyStartAt: ownerData.journeyStartAt,
    }) || brandName;
  const profileImage = getAbsoluteImageUrl(getOwnerAvatarPath());

  const personId = `${homeUrl}#person`;
  const websiteId = `${homeUrl}#website`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: ownerName,
        description,
        url: homeUrl,
        image: profileImage,
        sameAs: [`https://github.com/${ownerData.githubUser}`],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: homeUrl,
        name: brandName,
        description,
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  );
}
