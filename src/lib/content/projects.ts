import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { ZodError, flattenError } from "zod";

import { createContentPaths, isENOENT, type ContentPaths } from "./paths";
import type { Project } from "./display";
import { projectFrontMatterSchema, type ProjectDetails } from "./schemas";
import {
  InvalidProjectFrontMatterError,
  isProjectContentStrict,
  type ReadProjectResult,
} from "./projects-read";

type ProjectFrontMatter = Omit<ProjectDetails, "slug" | "content">;

type ReadProjectSourceResult =
  | {
      status: "ok";
      slug: string;
      frontMatter: ProjectFrontMatter;
      content: string;
    }
  | { status: "missing" }
  | { status: "invalid"; slug: string; cause: unknown; kind: "matter" | "zod" };

async function readProjectSource(
  slug: string,
  paths: ContentPaths,
): Promise<ReadProjectSourceResult> {
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
    return { status: "invalid", slug, cause: error, kind: "matter" };
  }

  const { data, content } = matterResult;
  const parsed = projectFrontMatterSchema.safeParse(data);
  if (!parsed.success) {
    return { status: "invalid", slug, cause: parsed.error, kind: "zod" };
  }

  return {
    status: "ok",
    slug,
    frontMatter: parsed.data,
    content,
  };
}

function logInvalidProjectFrontMatterZod(slug: string, cause: unknown): void {
  console.error(
    `Invalid front matter for project "${slug}":`,
    cause instanceof ZodError ? flattenError(cause) : cause,
  );
}

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
  const result = await readProjectSource(slug, paths);
  if (result.status === "missing") return { status: "missing" };
  if (result.status === "invalid") {
    if (result.kind === "zod") {
      logInvalidProjectFrontMatterZod(result.slug, result.cause);
    }
    return { status: "invalid", slug: result.slug, cause: result.cause };
  }

  const { slug: resolvedSlug, frontMatter, content } = result;
  return {
    status: "ok",
    project: { slug: resolvedSlug, ...frontMatter, content },
  };
}

export async function readAllProjectSummaries(
  paths: ContentPaths = createContentPaths(),
): Promise<Project[]> {
  const slugs = await listProjectSlugs(paths);
  const results = await Promise.all(
    slugs.map((slug) => readProjectSource(slug, paths)),
  );

  const strict = isProjectContentStrict();
  const summaries: Project[] = [];
  for (let i = 0; i < slugs.length; i++) {
    const result = results[i];
    if (result.status === "ok") {
      const { slug, frontMatter } = result;
      summaries.push({
        slug,
        name: frontMatter.name,
        coverImage: frontMatter.coverImage,
      });
      continue;
    }

    if (result.status === "missing") continue;

    if (strict) {
      throw new InvalidProjectFrontMatterError(result.slug, result.cause);
    }

    if (result.kind === "zod") {
      logInvalidProjectFrontMatterZod(result.slug, result.cause);
    }

    console.error(
      `Skipping project "${result.slug}" due to invalid front matter:`,
      result.cause,
    );
  }

  return summaries;
}
