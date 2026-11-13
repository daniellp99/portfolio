import { describe, expect, it } from "bun:test";

import {
  githubAuthErrorMessage,
  resolveGithubToken,
} from "@/features/contributions/lib/github-token";

describe("resolveGithubToken", () => {
  it("prefers GITHUB_PAT and trims whitespace", () => {
    expect(
      resolveGithubToken({
        GITHUB_PAT: "  ghp_example\n",
        GITHUB_TOKEN: "ignored",
      }),
    ).toEqual({ token: "ghp_example", source: "GITHUB_PAT" });
  });

  it("falls back to GITHUB_TOKEN then GH_TOKEN", () => {
    expect(resolveGithubToken({ GITHUB_TOKEN: "tok" })).toEqual({
      token: "tok",
      source: "GITHUB_TOKEN",
    });
    expect(resolveGithubToken({ GH_TOKEN: "tok" })).toEqual({
      token: "tok",
      source: "GH_TOKEN",
    });
  });

  it("ignores blank / whitespace-only values", () => {
    expect(
      resolveGithubToken({
        GITHUB_PAT: "   ",
        GITHUB_TOKEN: "\n",
        GH_TOKEN: "",
      }),
    ).toBeNull();
  });
});

describe("githubAuthErrorMessage", () => {
  it("mentions rotating GITHUB_PAT on 401", () => {
    expect(githubAuthErrorMessage(401)).toContain("Rotate GITHUB_PAT");
  });

  it("mentions scopes on 403", () => {
    expect(githubAuthErrorMessage(403)).toContain("scopes");
  });
});
