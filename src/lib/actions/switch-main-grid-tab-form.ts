"use server";

import { getProjectSlugs } from "@/lib/server/projects";
import { tabsTypeSchema, type TabsType } from "@/lib/site/tabs";

import { switchMainGridTab } from "./switch-main-grid-tab";

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
