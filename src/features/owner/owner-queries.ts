import "server-only";

import { cache } from "react";

import { rawOwnerData } from "@/content/owner-data";
import {
  ownerDataSchema,
  type OwnerData,
} from "@/features/owner/owner-schemas";

export const getOwnerData = cache((): OwnerData => {
  return ownerDataSchema.parse(rawOwnerData);
});

export type { OwnerData };
