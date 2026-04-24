import { buildHomeOgImageResponse } from "@/lib/og/build-home-og";
import {
  ogImageContentType as contentType,
  ogImageSize as size,
} from "@/lib/og/image-config";

export { contentType, size };

export const runtime = "nodejs";

export default buildHomeOgImageResponse;
