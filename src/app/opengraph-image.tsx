import { getOwnerData } from "@/features/owner/owner-queries";
import { buildHomeOgImageResponse } from "@/lib/og/build-home-og";
import {
  ogImageContentType as contentType,
  ogImageSize as size,
} from "@/lib/og/image-config";
import { brandTitle } from "@/lib/site/metadata/brand";

export const alt = brandTitle(getOwnerData().name);
export { contentType, size };

export default buildHomeOgImageResponse;
