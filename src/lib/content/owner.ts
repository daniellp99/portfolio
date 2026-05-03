import "server-only";

import fs from "node:fs/promises";

import { parse as parseYaml } from "yaml";
import { flattenError } from "zod";

import { createContentPaths, isENOENT, type ContentPaths } from "./paths";
import { ownerDataSchema, type OwnerData } from "./schemas";

export async function readOwnerData(
  paths: ContentPaths = createContentPaths(),
): Promise<OwnerData | null> {
  let raw: string;
  try {
    raw = await fs.readFile(paths.ownerYamlPath, "utf8");
  } catch (error) {
    if (isENOENT(error)) return null;
    throw error;
  }

  const data = parseYaml(raw);
  const parsed = ownerDataSchema.safeParse(data);
  if (!parsed.success) {
    console.warn("Invalid owner-data.yaml:", flattenError(parsed.error));
    return null;
  }
  return parsed.data;
}
