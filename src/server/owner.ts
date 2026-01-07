"use server";

import { getMapMarkerInfoDTO, getOwnerDataDTO } from "@/data/project-dto";
import { cacheLife, cacheTag } from "next/cache";

export async function getOwnerData() {
  "use cache";
  cacheLife("hours");
  cacheTag("owner_data");
  return await getOwnerDataDTO();
}

export async function getMapMarkerInfo() {
  "use cache";
  cacheLife("hours");
  cacheTag("map_marker_info");
  return await getMapMarkerInfoDTO();
}
