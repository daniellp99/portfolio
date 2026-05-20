import "server-only";

import type { Images } from "@/lib/content/display";
import { getProjectSlugs } from "@/lib/server/projects";
import {
  IMAGE_LAYOUTS_KEY,
  imageLayoutsKeyForSlug,
  MAIN_LAYOUTS_KEY,
} from "@/lib/site/constants";
import {
  expandFromCookie,
  generateImageLayouts,
  generateLayouts,
  imageSrcsFromImages,
  normalizeLayoutsFromCookie,
} from "@/lib/site/grid";
import { cookies } from "next/headers";
import { ResponsiveLayouts } from "react-grid-layout";

type GetMainLayoutsParams = { layoutKey: typeof MAIN_LAYOUTS_KEY };
type GetImageLayoutsParams = {
  layoutKey: typeof IMAGE_LAYOUTS_KEY;
  /** Route slug; may be missing in some RSC edge cases—key falls back to image srcs */
  projectSlug: string | undefined | null;
  images: Images;
};

type GetLayoutsParams = GetMainLayoutsParams | GetImageLayoutsParams;

function layoutsCookieName(params: GetLayoutsParams): string {
  if (params.layoutKey === MAIN_LAYOUTS_KEY) {
    return MAIN_LAYOUTS_KEY;
  }
  return imageLayoutsKeyForSlug(params.projectSlug, params.images);
}

export async function getLayouts(
  params: GetLayoutsParams,
): Promise<ResponsiveLayouts> {
  const cookieStore = await cookies();
  const layoutsCookie = cookieStore.get(layoutsCookieName(params));

  let defaultLayouts: ResponsiveLayouts = {};
  switch (params.layoutKey) {
    case MAIN_LAYOUTS_KEY: {
      const projectKeys = await getProjectSlugs();
      defaultLayouts = generateLayouts("All", projectKeys);
      break;
    }
    case IMAGE_LAYOUTS_KEY:
      defaultLayouts = generateImageLayouts(params.images);
      break;
  }

  if (layoutsCookie?.value) {
    const expandOptions =
      params.layoutKey === IMAGE_LAYOUTS_KEY
        ? { imageSrcs: imageSrcsFromImages(params.images) }
        : {};
    const expanded = expandFromCookie(layoutsCookie.value, expandOptions);
    if (expanded !== null) {
      return normalizeLayoutsFromCookie(expanded, defaultLayouts, true);
    }
  }

  return defaultLayouts;
}
