import "server-only";

import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { ResponsiveLayouts } from "react-grid-layout";

import { getProjectSlugs } from "@/features/projects/projects-queries";
import type { Images } from "@/lib/content/display";
import {
  IMAGE_LAYOUTS_KEY,
  imageLayoutsKeyForSlug,
  MAIN_LAYOUTS_KEY,
} from "@/lib/site/constants";
import {
  applyResizePolicyToLayouts,
  expandFromCookie,
  generateImageLayouts,
  generateLayouts,
  imageSrcsFromImages,
  normalizeLayoutsFromCookie,
} from "@/lib/site/grid";
import { getActiveTab } from "@/lib/site/tabs";

type GetMainLayoutsParams = { layoutKey: typeof MAIN_LAYOUTS_KEY };
type GetImageLayoutsParams = {
  layoutKey: typeof IMAGE_LAYOUTS_KEY;
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
  cookieStore: ReadonlyRequestCookies,
): Promise<ResponsiveLayouts> {
  const layoutsCookie = cookieStore.get(layoutsCookieName(params));

  let defaultLayouts: ResponsiveLayouts = {};
  switch (params.layoutKey) {
    case MAIN_LAYOUTS_KEY: {
      const projectKeys = await getProjectSlugs();
      const activeTab = getActiveTab(cookieStore);
      defaultLayouts = generateLayouts(activeTab, projectKeys);
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
      return applyResizePolicyToLayouts(
        normalizeLayoutsFromCookie(expanded, defaultLayouts, true),
        params.layoutKey,
      );
    }
  }

  return applyResizePolicyToLayouts(defaultLayouts, params.layoutKey);
}
