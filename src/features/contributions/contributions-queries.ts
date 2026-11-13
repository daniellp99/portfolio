import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { flattenError } from "zod";

import {
  contributionsMonthCacheTag,
  isCurrentContributionsMonth,
} from "@/features/contributions/lib/contributions-month";
import {
  githubAuthErrorMessage,
  resolveGithubToken,
} from "@/features/contributions/lib/github-token";
import { toIsoDateRangeForMonth } from "@/features/contributions/lib/month-range";
import {
  githubContributionGraphqlResponseSchema,
  githubContributionMonthResponseSchema,
  type GithubContributionCalendar,
  type GithubContributionMonthResponse,
} from "@/lib/schemas/github-contributions";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";

async function githubGraphql<T>(
  query: string,
  variables: Record<string, unknown>,
) {
  const resolved = resolveGithubToken();
  if (!resolved) {
    throw new Error(
      "Missing GitHub token. Set GITHUB_PAT (preferred) or GITHUB_TOKEN / GH_TOKEN " +
        "in Vercel → Project → Settings → Environment Variables for Production " +
        "(and Preview if needed).",
    );
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      // GitHub asks for a descriptive User-Agent on API calls.
      "user-agent": "daniellp99-portfolio-contributions",
      authorization: `Bearer ${resolved.token}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  // Auth failures often return a non-GraphQL JSON body; prefer status guidance.
  if (res.status === 401 || res.status === 403) {
    throw new Error(githubAuthErrorMessage(res.status));
  }

  const raw = await res.json();
  const parsed = githubContributionGraphqlResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Invalid GitHub GraphQL response: ${flattenError(parsed.error)}`,
    );
  }

  const json = parsed.data as {
    data?: T;
    errors?: Array<{ message?: string }>;
  };

  if (!res.ok || json.errors?.length) {
    const message =
      json.errors
        ?.map((e) => e.message)
        .filter(Boolean)
        .join("; ") || githubAuthErrorMessage(res.status);
    throw new Error(message);
  }

  if (!json.data) {
    throw new Error("GitHub GraphQL returned no data");
  }

  return json.data;
}

const QUERY = /* GraphQL */ `
  query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export const getGithubContributionsForMonth = cache(
  async (
    login: string,
    year: number,
    month: number,
    timeZone: string = CONTRIBUTIONS_TZ,
  ): Promise<GithubContributionMonthResponse> => {
    "use cache";
    cacheTag(contributionsMonthCacheTag(login, year, month, timeZone));
    if (isCurrentContributionsMonth(year, month, timeZone)) {
      cacheLife("hours");
    } else {
      cacheLife("weeks");
    }

    const { from, to } = toIsoDateRangeForMonth(year, month, timeZone);

    const data = await githubGraphql<{
      user: null | {
        contributionsCollection: {
          restrictedContributionsCount: number;
          contributionCalendar: GithubContributionCalendar;
        };
      };
    }>(QUERY, { login, from, to });

    if (!data.user) {
      throw new Error(`GitHub user not found: ${login}`);
    }

    const result = {
      year,
      month,
      calendar: data.user.contributionsCollection.contributionCalendar,
      restrictedContributionsCount:
        data.user.contributionsCollection.restrictedContributionsCount,
    };

    const validated = githubContributionMonthResponseSchema.safeParse(result);
    if (!validated.success) {
      throw new Error(
        `Invalid contributions payload: ${flattenError(validated.error)}`,
      );
    }

    return validated.data;
  },
);
