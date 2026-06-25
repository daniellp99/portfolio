import "server-only";

import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { ResponsiveLayouts } from "react-grid-layout";

import type { Images, ProjectSlugs } from "@/lib/content/display";
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

export type GetMainLayoutsParams = {
  layoutKey: typeof MAIN_LAYOUTS_KEY;
  projectSlugs: ProjectSlugs;
  projectSlug?: never;
  images?: never;
};

export type GetImageLayoutsParams = {
  layoutKey: typeof IMAGE_LAYOUTS_KEY;
  projectSlug: string | undefined | null;
  images: Images;
  projectSlugs?: never;
};

export type GetLayoutsParams = GetMainLayoutsParams | GetImageLayoutsParams;

function layoutsCookieName(params: GetLayoutsParams): string {
  if (params.layoutKey === MAIN_LAYOUTS_KEY) {
    return MAIN_LAYOUTS_KEY;
  }
  return imageLayoutsKeyForSlug(params.projectSlug, params.images);
}

export function getLayouts(
  params: GetLayoutsParams,
  cookieStore: ReadonlyRequestCookies,
): ResponsiveLayouts {
  const layoutsCookie = cookieStore.get(layoutsCookieName(params));

  let defaultLayouts: ResponsiveLayouts = {};
  switch (params.layoutKey) {
    case MAIN_LAYOUTS_KEY: {
      const activeTab = getActiveTab(cookieStore);
      defaultLayouts = generateLayouts(activeTab, params.projectSlugs);
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
