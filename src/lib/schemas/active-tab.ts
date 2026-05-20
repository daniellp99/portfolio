import * as z from "zod";

import { TABS, type TabsType } from "@/lib/site/tabs";

export const tabsTypeSchema = z.enum([TABS.ALL, TABS.ABOUT, TABS.PROJECTS]);

export const DEFAULT_ACTIVE_TAB = TABS.ALL satisfies TabsType;

/** Cookie read path: invalid / missing → All */
export function parseActiveTab(value: string | undefined): TabsType {
  const result = tabsTypeSchema.safeParse(value);
  return result.success ? result.data : DEFAULT_ACTIVE_TAB;
}
