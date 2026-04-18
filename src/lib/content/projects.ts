import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { flattenError } from "zod";

import {
  projectFrontMatterSchema,
  type ProjectDetails,
} from "./schemas";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

export async function listProjectSlugs(): Promise<string[]> {
  const entries = await fs.readdir(PROJECTS_DIR);
  return entries
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.basename(f, ".mdx"))
    .sort();
}

export async function readProject(
  slug: string,
): Promise<ProjectDetails | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
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

export async function readAllProjectSummaries(): Promise<
  Array<{ slug: string; name: string; coverImage: string }>
> {
  const slugs = await listProjectSlugs();
  const summaries: Array<{ slug: string; name: string; coverImage: string }> =
    [];

  for (const slug of slugs) {
    const project = await readProject(slug);
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
