import { getOwnerData } from "@/server/owner";
import { getProjectDetails } from "@/server/projects";
import { getAbsoluteImageUrl, getCanonicalUrl } from "@/utils/metadata";

export default async function ProjectJsonLd({ slug }: { slug: string }) {
  const project = await getProjectDetails(slug);
  const ownerData = await getOwnerData();

  const ownerName = ownerData?.name || "Daniel";
  const projectUrl = getCanonicalUrl(`/project/${slug}`);
  // Ensure coverImage path has leading slash for consistency
  const coverImagePath = project.coverImage
    ? project.coverImage.startsWith("/")
      ? project.coverImage
      : `/${project.coverImage}`
    : "/LightLogo.svg";
  const projectImage = getAbsoluteImageUrl(coverImagePath);

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description:
      project.description || `${project.name} - A project by ${ownerName}`,
    image: projectImage,
    url: projectUrl,
    author: {
      "@type": "Person",
      name: ownerName,
    },
    ...(project.status && {
      creativeWorkStatus: project.status,
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
