import { buildProjectOgImageResponse } from "@/lib/og/build-project-og";
import {
  ogImageContentType as contentType,
  ogImageSize as size,
} from "@/lib/og/image-config";

export { contentType, size };

export const runtime = "nodejs";

export default async function Image(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return buildProjectOgImageResponse(slug);
}
