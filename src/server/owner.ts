"use server";

import { getOwnerDataDTO } from "@/data/project-dto";
import { cacheLife, cacheTag } from "next/cache";

export async function getOwnerData() {
  "use cache";
  cacheLife("hours");
  cacheTag("owner_data");
  return await getOwnerDataDTO();
}
