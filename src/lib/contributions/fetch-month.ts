import { flattenError } from "zod";

import {
  githubContributionMonthResponseSchema,
  type GithubContributionMonthResponse,
} from "@/lib/schemas/github-contributions";

import { CONTRIBUTIONS_TZ } from "./constants";

type FetchErrorResponse = { error?: string; details?: string };

export function contributionsMonthCacheKey(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
) {
  return `${year}-${month}-${timeZone}`;
}

export function buildContributionsMonthApiUrl(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
): string {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
    tz: timeZone,
  });
  return `/api/github/contributions?${params.toString()}`;
}

export function parseGithubContributionMonthResponse(
  json: unknown,
): GithubContributionMonthResponse {
  const parsed = githubContributionMonthResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `Invalid contributions response: ${flattenError(parsed.error)}`,
    );
  }
  return parsed.data;
}

function messageFromErrorJson(json: unknown): string | undefined {
  const o = json as FetchErrorResponse;
  return o?.details || o?.error;
}

const contributionPromiseCache = new Map<
  string,
  Promise<GithubContributionMonthResponse>
>();

/** Clears in-flight / resolved month fetch cache (for tests). */
export function clearContributionsPromiseCache(): void {
  contributionPromiseCache.clear();
}

export function evictContributionsMonthCache(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
): void {
  contributionPromiseCache.delete(
    contributionsMonthCacheKey(year, month, timeZone),
  );
}

export function getContributionsPromise(
  year: number,
  month: number,
  timeZone: string = CONTRIBUTIONS_TZ,
  fetchImpl: typeof fetch = fetch,
): Promise<GithubContributionMonthResponse> {
  const key = contributionsMonthCacheKey(year, month, timeZone);
  const existing = contributionPromiseCache.get(key);
  if (existing) return existing;

  const url = buildContributionsMonthApiUrl(year, month, timeZone);
  const promise = fetchImpl(url, { cache: "no-store" }).then(async (res) => {
    const json = (await res.json()) as unknown;
    if (!res.ok) {
      const message =
        messageFromErrorJson(json) || "Failed to load contributions.";
      throw new Error(String(message));
    }
    return parseGithubContributionMonthResponse(json);
  });

  contributionPromiseCache.set(key, promise);
  return promise;
}
