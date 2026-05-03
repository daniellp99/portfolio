import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { flattenError } from "zod";

import { createContentPaths, isENOENT, type ContentPaths } from "./paths";
import type { Project } from "./display";
import { projectFrontMatterSchema, type ProjectDetails } from "./schemas";
import {
  InvalidProjectFrontMatterError,
  isProjectContentStrict,
  type ReadProjectResult,
} from "./projects-read";

export async function listProjectSlugs(
  paths: ContentPaths = createContentPaths(),
): Promise<string[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(paths.projectsDir);
  } catch (error) {
    if (isENOENT(error)) return [];
    throw error;
  }

  return entries
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.basename(f, ".mdx"))
    .sort();
}

export async function readProject(
  slug: string,
  paths: ContentPaths = createContentPaths(),
): Promise<ReadProjectResult> {
  const filePath = path.join(paths.projectsDir, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (isENOENT(error)) return { status: "missing" };
    throw error;
  }

  let matterResult: ReturnType<typeof matter>;
  try {
    matterResult = matter(raw);
  } catch (error) {
    return { status: "invalid", slug, cause: error };
  }

  const { data, content } = matterResult;
  const parsed = projectFrontMatterSchema.safeParse(data);
  if (!parsed.success) {
    console.error(
      `Invalid front matter for project "${slug}":`,
      flattenError(parsed.error),
    );
    return { status: "invalid", slug, cause: parsed.error };
  }

  return { status: "ok", project: { slug, ...parsed.data, content } };
}

export async function readAllProjectSummaries(
  paths: ContentPaths = createContentPaths(),
): Promise<Project[]> {
  const slugs = await listProjectSlugs(paths);
  const results = await Promise.all(
    slugs.map((slug) => readProject(slug, paths)),
  );

  const strict = isProjectContentStrict();
  const summaries: Project[] = [];
  for (let i = 0; i < slugs.length; i++) {
    const result = results[i];
    if (result.status === "ok") {
      const { project } = result;
      summaries.push({ slug: project.slug, name: project.name, coverImage: project.coverImage });
      continue;
    }

    if (result.status === "missing") continue;

    if (strict) {
      throw new InvalidProjectFrontMatterError(result.slug, result.cause);
    }

    console.error(
      `Skipping project "${result.slug}" due to invalid front matter:`,
      result.cause,
    );
  }

  return summaries;
}
