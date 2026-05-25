import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import * as z from "zod";

import { ACTIVE_TAB_KEY } from "@/lib/site/constants";

const TABS = {
  ALL: "All",
  ABOUT: "About",
  PROJECTS: "Projects",
} as const;

const DEFAULT_ACTIVE_TAB = TABS.ALL satisfies TabsType;

export type TabsType = (typeof TABS)[keyof typeof TABS];

export const tabs: TabsType[] = Object.values(TABS).map(
  (tab) => tab as TabsType,
);

export const tabsTypeSchema = z.enum([TABS.ALL, TABS.ABOUT, TABS.PROJECTS]);

export function getActiveTab(cookieStore: ReadonlyRequestCookies): TabsType {
  const result = tabsTypeSchema.safeParse(
    cookieStore.get(ACTIVE_TAB_KEY)?.value,
  );
  return result.success ? result.data : DEFAULT_ACTIVE_TAB;
}
