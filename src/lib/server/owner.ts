"use server";

import { loadMapMarkerInfo, loadOwnerData } from "@/lib/server/content-load";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

export const getOwnerData = cache(async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("owner_data");
  return await loadOwnerData();
});

export const getMapMarkerInfo = cache(async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("map_marker_info");
  return await loadMapMarkerInfo();
});
