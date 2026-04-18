import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { parse as parseYaml } from "yaml";
import { flattenError } from "zod";

import { ownerDataSchema, type OwnerData } from "./schemas";

const OWNER_DATA_PATH = path.join(
  process.cwd(),
  "src/content/owner-data.yaml",
);

export async function readOwnerData(): Promise<OwnerData | null> {
  try {
    const raw = await fs.readFile(OWNER_DATA_PATH, "utf8");
    const data = parseYaml(raw);
    const parsed = ownerDataSchema.safeParse(data);
    if (!parsed.success) {
      console.warn("Invalid owner-data.yaml:", flattenError(parsed.error));
      return null;
    }
    return parsed.data;
  } catch (error) {
    console.warn("Failed to read owner-data.yaml:", error);
    return null;
  }
}
