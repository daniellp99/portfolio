import { getOwnerData } from "@/features/owner/owner-queries";
import { renderAboutMeCached } from "@/lib/content/render-about-me";
import { serializeJsonLd } from "@/lib/json-ld";
import {
  getAbsoluteImageUrl,
  getCanonicalUrl,
  getOwnerAvatarPath,
} from "@/lib/site/metadata";

export async function HomeJsonLd() {
  const ownerData = getOwnerData();
  const ownerName = ownerData.name;
  const homeUrl = getCanonicalUrl("");
  const brandName = `${ownerName}'s Portfolio`;
  const description =
    (await renderAboutMeCached({
      aboutMe: ownerData.aboutMe,
      name: ownerData.name,
      journeyStartAt: ownerData.journeyStartAt,
    })) || brandName;
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
