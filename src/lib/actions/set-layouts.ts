"use server";

import { COOKIE_MAX_AGE, type LayoutKey } from "@/lib/site/constants";
import {
  compactForCookie,
  cookieValueWithinLimit,
  type LayoutPersistenceOptions,
} from "@/lib/site/grid";
import { cookies } from "next/headers";
import type { ResponsiveLayouts } from "react-grid-layout";

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
