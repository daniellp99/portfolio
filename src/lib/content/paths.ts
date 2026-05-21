import path from "node:path";

export type ContentPaths = {
  projectsDir: string;
};

export function isENOENT(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}

/** Production layout: `<cwd>/src/content/...` */
export function createContentPaths(cwd: string = process.cwd()): ContentPaths {
  return {
    projectsDir: path.join(cwd, "src/content/projects"),
  };
}

/** Flat fixture dir: `<dir>/projects/*.mdx` */
export function createFixtureContentPaths(fixtureDir: string): ContentPaths {
  return {
    projectsDir: path.join(fixtureDir, "projects"),
  };
}
