import "server-only";

import { endOfMonth, startOfMonth } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { flattenError } from "zod";

import {
  githubContributionGraphqlResponseSchema,
  githubContributionMonthResponseSchema,
  type GithubContributionCalendar,
  type GithubContributionMonthResponse,
} from "@/lib/schemas/github-contributions";

function toIsoDateRangeForMonth(
  year: number,
  month: number,
  timeZone: string = "UTC",
) {
  const monthIndex = month - 1;

  // "Wall clock" dates in the user's time zone, then converted to UTC instants.
  const monthWallClock = new Date(year, monthIndex, 1, 0, 0, 0, 0);
  const fromWallClock = startOfMonth(monthWallClock);
  const toWallClock = endOfMonth(monthWallClock);
  toWallClock.setHours(23, 59, 59, 999);

  const from = fromZonedTime(fromWallClock, timeZone).toISOString();
  const to = fromZonedTime(toWallClock, timeZone).toISOString();

  return { from, to };
}

async function githubGraphql<T>(
  query: string,
  variables: Record<string, unknown>,
) {
  const token = process.env.GITHUB_PAT;
  if (!token) {
    throw new Error("Missing GITHUB_PAT");
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

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
        .join("; ") || `GitHub GraphQL request failed (${res.status})`;
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
    timeZone: string = "UTC",
  ): Promise<GithubContributionMonthResponse> => {
    "use cache";
    cacheLife("hours");
    cacheTag(`github_contrib_${login}_${year}_${month}_${timeZone}`);

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
