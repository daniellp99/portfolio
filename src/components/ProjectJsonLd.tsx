import { getOwnerData } from "@/lib/server/owner";
import { getProjectDetails } from "@/lib/server/projects";
import { serializeJsonLd } from "@/lib/json-ld";
import { getAbsoluteImageUrl, getCanonicalUrl } from "@/lib/site/metadata";

export default async function ProjectJsonLd({ slug }: { slug: string }) {
  const project = await getProjectDetails(slug);
  const ownerData = await getOwnerData();

  const ownerName = ownerData?.name || "Daniel";
  const homeUrl = getCanonicalUrl("");
  const projectUrl = getCanonicalUrl(`/project/${slug}`);
  const coverImagePath = project.coverImage
    ? project.coverImage.startsWith("/")
      ? project.coverImage
      : `/${project.coverImage}`
    : "/Avatar.webp";
  const projectImage = getAbsoluteImageUrl(coverImagePath);

  const authorUrl = ownerData?.githubUser
    ? `https://github.com/${ownerData.githubUser}`
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${projectUrl}#creativework`,
        name: project.name,
        description:
          project.description || `${project.name} - A project by ${ownerName}`,
        image: projectImage,
        url: projectUrl,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": projectUrl,
        },
        author: {
          "@type": "Person",
          name: ownerName,
          ...(authorUrl && { url: authorUrl }),
        },
        ...(project.status && {
          creativeWorkStatus: project.status,
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: project.name,
            item: projectUrl,
          },
        ],
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
