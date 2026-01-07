import { createReader } from "@keystatic/core/reader";
import { createGitHubReader } from "@keystatic/core/reader/github";
import keystaticConfig from "../../keystatic.config";

const isProd = process.env.NODE_ENV === "production";

export const reader = isProd
  ? createGitHubReader(keystaticConfig, {
      repo: "daniellp99/portfolio",
      token: process.env.GITHUB_PAT,
    })
  : createReader(process.cwd(), keystaticConfig);
