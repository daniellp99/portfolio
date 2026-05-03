"use server";

import { jsonToLayouts } from "@/lib/schemas/layouts";
import { COOKIE_MAX_AGE, type LayoutKey } from "@/lib/site/constants";
import { cookies } from "next/headers";
import type { ResponsiveLayouts } from "react-grid-layout";

export async function setLayouts(
  layouts: ResponsiveLayouts,
  layoutKey: LayoutKey,
): Promise<void> {
  try {
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
