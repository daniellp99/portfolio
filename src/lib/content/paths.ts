import path from "node:path";

export type ContentPaths = {
  ownerYamlPath: string;
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
    ownerYamlPath: path.join(cwd, "src/content/owner-data.yaml"),
    projectsDir: path.join(cwd, "src/content/projects"),
  };
}

/** Flat fixture dir: `<dir>/owner-data.yaml`, `<dir>/projects/*.mdx` */
export function createFixtureContentPaths(fixtureDir: string): ContentPaths {
  return {
    ownerYamlPath: path.join(fixtureDir, "owner-data.yaml"),
    projectsDir: path.join(fixtureDir, "projects"),
  };
}
