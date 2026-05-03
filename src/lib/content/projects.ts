import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { flattenError } from "zod";

import { createContentPaths, isENOENT, type ContentPaths } from "./paths";
import {
  projectFrontMatterSchema,
  type Project,
  type ProjectDetails,
} from "./schemas";

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
): Promise<ProjectDetails | null> {
  const filePath = path.join(paths.projectsDir, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (isENOENT(error)) return null;
    throw error;
  }

  const { data, content } = matter(raw);
  const parsed = projectFrontMatterSchema.safeParse(data);
  if (!parsed.success) {
    console.error(
      `Invalid front matter for project "${slug}":`,
      flattenError(parsed.error),
    );
    return null;
  }

  return { slug, ...parsed.data, content };
}

export async function readAllProjectSummaries(
  paths: ContentPaths = createContentPaths(),
): Promise<Project[]> {
  const slugs = await listProjectSlugs(paths);
  const summaries: Project[] = [];

  for (const slug of slugs) {
    const project = await readProject(slug, paths);
    if (project) {
      summaries.push({
        slug: project.slug,
        name: project.name,
        coverImage: project.coverImage,
      });
    }
  }

  return summaries;
}
