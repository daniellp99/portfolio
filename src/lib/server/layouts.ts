"use server";
import { ResponsiveLayouts } from "react-grid-layout";
import "server-only";

import type { Images } from "@/lib/content/display";
import { getProjectSlugs } from "@/lib/server/projects";
import {
  IMAGE_LAYOUTS_KEY,
  imageLayoutsKeyForSlug,
  mainLayoutsKeyForTab,
  MAIN_LAYOUTS_KEY,
} from "@/lib/site/constants";
import {
  expandFromCookie,
  generateImageLayouts,
  generateLayouts,
  imageSrcsFromImages,
  normalizeLayoutsFromCookie,
} from "@/lib/site/grid";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { getActiveTab } from "../site/tabs";

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
  cookieStore: ReadonlyRequestCookies,
): Promise<ResponsiveLayouts> {
  let defaultLayouts: ResponsiveLayouts = {};
  let layoutsCookie:
    | ReturnType<ReadonlyRequestCookies["get"]>
    | null
    | undefined;
  switch (params.layoutKey) {
    case MAIN_LAYOUTS_KEY: {
      const projectKeys = await getProjectSlugs();
      const activeTab = getActiveTab(cookieStore);
      defaultLayouts = generateLayouts(activeTab, projectKeys);
      layoutsCookie =
        cookieStore.get(mainLayoutsKeyForTab(activeTab)) ??
        (activeTab === "All" ? cookieStore.get(MAIN_LAYOUTS_KEY) : undefined);
      break;
    }
    case IMAGE_LAYOUTS_KEY:
      defaultLayouts = generateImageLayouts(params.images);
      layoutsCookie = cookieStore.get(layoutsCookieName(params));
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
