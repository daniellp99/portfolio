import { createGitHubReader } from "@keystatic/core/reader/github";
import keystaticConfig from "../../keystatic.config";

export const reader = createGitHubReader(keystaticConfig, {
  repo: "daniellp99/portfolio",
  token: process.env.GITHUB_PAT,
});
