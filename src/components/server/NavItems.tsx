import { cookies } from "next/headers";

import NavItemsClient from "@/components/NavItems";
import { Skeleton } from "@/components/ui/skeleton";
import type { MainGridTabFormState } from "@/lib/actions/switch-main-grid-tab-form";
import { getActiveTab } from "@/lib/site/tabs";

export function NavItemsFallback() {
  return <Skeleton className="h-12 w-68.25 rounded-full" />;
}

export default async function NavItems() {
  const cookieStore = await cookies();
  const initialState: MainGridTabFormState = {
    activeTab: getActiveTab(cookieStore),
  };

  return <NavItemsClient initialState={initialState} />;
}
