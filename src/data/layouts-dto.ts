"use server";
import { jsonToLayouts } from "@/schemas/layouts";
import { COOKIE_MAX_AGE, LAYOUTS_COOKIE_KEY } from "@/utils/constants";
import { generateLayouts } from "@/utils/layout";
import { cookies } from "next/headers";
import { ResponsiveLayouts } from "react-grid-layout";
import { getProjectSlugsDTO } from "./project-dto";

export async function getLayouts(): Promise<ResponsiveLayouts> {
  const cookieStore = await cookies();
  const layoutsCookie = cookieStore.get(LAYOUTS_COOKIE_KEY);

  if (layoutsCookie?.value) {
    const parsed = jsonToLayouts.safeDecode(layoutsCookie.value);

    if (parsed.success) {
      return parsed.data;
    }
  }
  const projectKeys = await getProjectSlugsDTO();
  const defaultLayouts = generateLayouts("All", projectKeys);
  return defaultLayouts;
}

export async function setLayouts(layouts: ResponsiveLayouts): Promise<void> {
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
    cookieStore.set(LAYOUTS_COOKIE_KEY, encoded, {
      expires: expires,
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Error setting layouts cookie:", error);
  }
}
