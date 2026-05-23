import { cookies } from "next/headers";

import { getActiveTab } from "@/lib/site/tabs";

import NavItemsClient from "../NavItems";
import { Skeleton } from "../ui/skeleton";

export function NavItemsFallback() {
  return <Skeleton className="h-12 w-68.25 rounded-full" />;
}

export default async function NavItems() {
  const cookieStore = await cookies();
  const initialActiveTab = getActiveTab(cookieStore);
  return <NavItemsClient initialActiveTab={initialActiveTab} />;
}
