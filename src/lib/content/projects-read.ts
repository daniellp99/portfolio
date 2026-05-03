export type ReadProjectResult =
  | { status: "ok"; project: ProjectDetails }
  | { status: "missing" }
  | { status: "invalid"; slug: string; cause: unknown };

export class InvalidProjectFrontMatterError extends Error {
  readonly slug: string;

  constructor(slug: string, cause: unknown) {
    super(`Invalid front matter for project "${slug}".`, { cause });
    this.name = "InvalidProjectFrontMatterError";
    this.slug = slug;
  }
}

export function isProjectContentStrict(): boolean {
  const override = process.env.PROJECT_CONTENT_STRICT;
  if (override === "1") return true;
  if (override === "0") return false;

  return Boolean(process.env.CI) || process.env.NODE_ENV === "development";
}

// Type-only import to avoid a cycle at runtime.
import type { ProjectDetails } from "./schemas";
