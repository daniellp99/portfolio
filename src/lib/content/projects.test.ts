import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "bun:test";

import { createFixtureContentPaths } from "./paths";
import {
  listProjectSlugs,
  readAllProjectSummaries,
  readProject,
} from "./projects";

const fixtureDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "__fixtures__/minimal",
);

const paths = createFixtureContentPaths(fixtureDir);

describe("listProjectSlugs", () => {
  it("lists mdx slugs from fixture dir", async () => {
    await expect(listProjectSlugs(paths)).resolves.toEqual(["sample"]);
  });

  it("returns empty array when projects dir is missing", async () => {
    const empty = createFixtureContentPaths(
      path.join(fixtureDir, "no-projects-dir"),
    );
    await expect(listProjectSlugs(empty)).resolves.toEqual([]);
  });
});

describe("readProject", () => {
  it("reads fixture project", async () => {
    const p = await readProject("sample", paths);
    expect(p).not.toBeNull();
    expect(p?.slug).toBe("sample");
    expect(p?.name).toBe("Sample Project");
  });

  it("returns null for missing slug", async () => {
    await expect(readProject("missing", paths)).resolves.toBeNull();
  });
});

describe("readAllProjectSummaries", () => {
  it("returns summaries for fixture projects", async () => {
    const rows = await readAllProjectSummaries(paths);
    expect(rows).toEqual([
      {
        slug: "sample",
        name: "Sample Project",
        coverImage: "https://example.com/cover.webp",
      },
    ]);
  });
});
