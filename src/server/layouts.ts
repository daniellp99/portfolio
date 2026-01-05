"use server";
import { getProjectSlugsDTO, Images } from "@/data/project-dto";
import { jsonToLayouts } from "@/schemas/layouts";
import {
  COOKIE_MAX_AGE,
  IMAGE_LAYOUTS_KEY,
  LayoutKey,
  MAIN_LAYOUTS_KEY,
} from "@/utils/constants";
import { generateImageLayouts, generateLayouts } from "@/utils/layout";
import { cookies } from "next/headers";
import { ResponsiveLayouts } from "react-grid-layout";

type GetMainLayoutsParams = { layoutKey: typeof MAIN_LAYOUTS_KEY };
type GetImageLayoutsParams = {
  layoutKey: typeof IMAGE_LAYOUTS_KEY;
  images: Images;
};

type GetLayoutsParams = GetMainLayoutsParams | GetImageLayoutsParams;

export async function getLayouts(
  params: GetLayoutsParams,
): Promise<ResponsiveLayouts> {
  const cookieStore = await cookies();
  const layoutsCookie = cookieStore.get(params.layoutKey);

  if (layoutsCookie?.value) {
    const parsed = jsonToLayouts.safeDecode(layoutsCookie.value);

    if (parsed.success) {
      return parsed.data;
    }
  }
  let defaultLayouts: ResponsiveLayouts = {};
  switch (params.layoutKey) {
    case MAIN_LAYOUTS_KEY:
      const projectKeys = await getProjectSlugsDTO();
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
