"use server";

import { cookies } from "next/headers";

import { ACTIVE_TAB_KEY, COOKIE_MAX_AGE } from "@/lib/site/constants";
import { tabsTypeSchema } from "@/lib/site/tabs";

export async function switchMainGridTab(tab: unknown): Promise<void> {
  const parsed = tabsTypeSchema.safeParse(tab);
  if (!parsed.success) return;

  const expires = new Date();
  expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_TAB_KEY, parsed.data, {
    expires,
    path: "/",
    sameSite: "lax",
  });
}
