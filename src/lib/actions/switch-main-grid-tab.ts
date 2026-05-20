"use server";

import { cookies } from "next/headers";

import { setLayouts } from "@/lib/actions/set-layouts";
import type { ProjectSlugs } from "@/lib/content/display";
import { tabsTypeSchema } from "@/lib/schemas/active-tab";
import {
  ACTIVE_TAB_KEY,
  COOKIE_MAX_AGE,
  MAIN_LAYOUTS_KEY,
} from "@/lib/site/constants";
import { generateLayouts, mainGridAllowedLayoutIds } from "@/lib/site/grid";

export async function switchMainGridTab(
  tab: unknown,
  projectSlugs: ProjectSlugs,
): Promise<void> {
  const parsed = tabsTypeSchema.safeParse(tab);
  if (!parsed.success) return;

  const layouts = generateLayouts(parsed.data, projectSlugs);
  const allowedLayoutIds = mainGridAllowedLayoutIds(projectSlugs);
  await setLayouts(layouts, MAIN_LAYOUTS_KEY, { allowedLayoutIds });

  const expires = new Date();
  expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_TAB_KEY, parsed.data, {
    expires,
    path: "/",
    sameSite: "lax",
  });
}
