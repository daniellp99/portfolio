"use server";
import { jsonToLayouts } from "@/lib/schemas/layouts";
import type { Images } from "@/lib/content/schemas";
import { getProjectSlugs } from "@/lib/server/projects";
import {
  COOKIE_MAX_AGE,
  IMAGE_LAYOUTS_KEY,
  imageLayoutsKeyForSlug,
  LayoutKey,
  MAIN_LAYOUTS_KEY,
} from "@/lib/site/constants";
import { generateImageLayouts, generateLayouts } from "@/lib/site/layout";
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

  if (layoutsCookie?.value) {
    const parsed = jsonToLayouts.safeDecode(layoutsCookie.value);

    if (parsed.success) {
      return parsed.data;
    }
  }
  let defaultLayouts: ResponsiveLayouts = {};
  switch (params.layoutKey) {
    case MAIN_LAYOUTS_KEY:
      const projectKeys = await getProjectSlugs();
      defaultLayouts = generateLayouts("All", projectKeys);
      break;
    case IMAGE_LAYOUTS_KEY:
      defaultLayouts = generateImageLayouts(params.images);
      break;
  }
  return defaultLayouts;
}

export async function setLayouts(
  layouts: ResponsiveLayouts,
  layoutKey: LayoutKey,
): Promise<void> {
  try {
    // Filter out undefined values and convert readonly arrays to mutable arrays
    const filteredLayouts = Object.fromEntries(
      Object.entries(layouts)
        .filter(
          (entry): entry is [string, NonNullable<(typeof entry)[1]>] =>
            entry[1] !== undefined,
        )
        .map(([key, value]) => [key, [...value]]),
    );
    const encoded = jsonToLayouts.encode(filteredLayouts);
    const expires = new Date();
    expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);

    const cookieStore = await cookies();
    cookieStore.set(layoutKey, encoded, {
      expires: expires,
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Error setting layouts cookie:", error);
  }
}
