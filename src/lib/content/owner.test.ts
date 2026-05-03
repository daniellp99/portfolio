import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "bun:test";

import { readOwnerData } from "./owner";
import { createFixtureContentPaths } from "./paths";

const fixtureDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "__fixtures__/minimal",
);

describe("readOwnerData", () => {
  it("reads valid fixture YAML", async () => {
    const data = await readOwnerData(createFixtureContentPaths(fixtureDir));
    expect(data).not.toBeNull();
    expect(data?.name).toBe("Fixture User");
    expect(data?.githubUser).toBe("fixture");
  });

  it("returns null when owner file is missing", async () => {
    const emptyDir = path.join(fixtureDir, "no-owner-here");
    const data = await readOwnerData(createFixtureContentPaths(emptyDir));
    expect(data).toBeNull();
  });
});
