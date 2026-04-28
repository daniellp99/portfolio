"use server";

import { getMapMarkerInfoDTO, getOwnerDataDTO } from "@/lib/server/project-dto";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

export const getOwnerData = cache(async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("owner_data");
  return await getOwnerDataDTO();
});

export const getMapMarkerInfo = cache(async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("map_marker_info");
  return await getMapMarkerInfoDTO();
});
