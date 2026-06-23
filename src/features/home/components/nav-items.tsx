import { cookies } from "next/headers";

import NavItemsClient from "@/components/NavItems";
import type { MainGridTabFormState } from "@/features/home/home-actions";
import { getActiveTab } from "@/lib/site/tabs";

export async function NavItems() {
  const cookieStore = await cookies();
  const initialState: MainGridTabFormState = {
    activeTab: getActiveTab(cookieStore),
  };

  return <NavItemsClient initialState={initialState} />;
}
