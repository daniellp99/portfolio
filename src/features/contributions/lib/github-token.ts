/**
 * Resolve the GitHub token used for the contributions GraphQL calendar.
 *
 * Preferred name: `GITHUB_PAT` (fine-grained or classic personal access token).
 * Fallbacks: `GITHUB_TOKEN`, `GH_TOKEN` (common aliases / CLI defaults).
 *
 * Values are trimmed — trailing newlines from Vercel/dashboard paste are a
 * frequent cause of HTTP 401 Bad credentials.
 */
export const GITHUB_TOKEN_ENV_KEYS = [
  "GITHUB_PAT",
  "GITHUB_TOKEN",
  "GH_TOKEN",
] as const;

export type GithubTokenEnvKey = (typeof GITHUB_TOKEN_ENV_KEYS)[number];

export type ResolvedGithubToken = {
  token: string;
  source: GithubTokenEnvKey;
};

export function resolveGithubToken(
  env: NodeJS.ProcessEnv = process.env,
): ResolvedGithubToken | null {
  for (const key of GITHUB_TOKEN_ENV_KEYS) {
    const raw = env[key];
    if (typeof raw !== "string") continue;
    const token = raw.trim();
    if (!token) continue;
    return { token, source: key };
  }
  return null;
}

export function githubAuthErrorMessage(status: number): string {
  if (status === 401) {
    return (
      "GitHub GraphQL rejected credentials (401). " +
      "Rotate GITHUB_PAT in Vercel → Project → Settings → Environment Variables " +
      "(Production, and Preview if used). Use a fine-grained or classic PAT; " +
      "trim whitespace when pasting. Classic needs no scopes for public calendars; " +
      "fine-grained needs Account → Profile: Read."
    );
  }
  if (status === 403) {
    return (
      `GitHub GraphQL forbidden (403). Check PAT scopes/permissions and rate limits.`
    );
  }
  return `GitHub GraphQL request failed (${status})`;
}
