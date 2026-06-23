"use server";

import { cookies } from "next/headers";
import type { ResponsiveLayouts } from "react-grid-layout";

import { getProjectSlugs } from "@/features/projects/projects-queries";
import type { ProjectSlugs } from "@/lib/content/display";
import {
  ACTIVE_TAB_KEY,
  COOKIE_MAX_AGE,
  MAIN_LAYOUTS_KEY,
  type LayoutKey,
} from "@/lib/site/constants";
import {
  compactForCookie,
  cookieValueWithinLimit,
  generateLayouts,
  mainGridAllowedLayoutIds,
  type LayoutPersistenceOptions,
} from "@/lib/site/grid";
import { tabsTypeSchema, type TabsType } from "@/lib/site/tabs";

export type SetLayoutsOptions = LayoutPersistenceOptions;

export async function setLayouts(
  layouts: ResponsiveLayouts,
  layoutKey: LayoutKey,
  options: SetLayoutsOptions = {},
): Promise<void> {
  try {
    const encoded = compactForCookie(layouts, options);

    if (!cookieValueWithinLimit(layoutKey, encoded)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Skipping layout cookie "${layoutKey}": encoded length ${layoutKey.length + encoded.length} exceeds 4096`,
        );
      }
      return;
    }

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

async function switchMainGridTab(
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

export type MainGridTabFormState = {
  activeTab: TabsType;
};

export async function switchMainGridTabFormAction(
  prevState: MainGridTabFormState,
  formData: FormData,
): Promise<MainGridTabFormState> {
  const parsed = tabsTypeSchema.safeParse(formData.get("tab"));
  if (!parsed.success) {
    return prevState;
  }

  const tab = parsed.data;
  if (tab === prevState.activeTab) {
    return prevState;
  }

  const projectSlugs = await getProjectSlugs();
  await switchMainGridTab(tab, projectSlugs);

  return { activeTab: tab };
}
