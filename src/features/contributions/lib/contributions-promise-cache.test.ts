import { describe, expect, test } from "bun:test";

import { getClientCachedContributionsPromise } from "@/features/contributions/lib/contributions-promise-cache";
import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

function fakePromise(
  label: string,
): Promise<GithubContributionMonthResponse> {
  return Promise.resolve({
    year: 2024,
    month: 1,
    calendar: { totalContributions: label.length, weeks: [] },
    restrictedContributionsCount: 0,
  });
}

describe("getClientCachedContributionsPromise", () => {
  test("reuses the same thenable for a key", () => {
    const key = `test-reuse-${Math.random()}`;
    const first = fakePromise("a");
    const second = fakePromise("b");

    const a = getClientCachedContributionsPromise(key, first);
    const b = getClientCachedContributionsPromise(key, second);

    expect(a).toBe(first);
    expect(b).toBe(first);
  });

  test("bust replaces the cached thenable", () => {
    const key = `test-bust-${Math.random()}`;
    const first = fakePromise("a");
    const second = fakePromise("b");

    getClientCachedContributionsPromise(key, first);
    const next = getClientCachedContributionsPromise(key, second, {
      bust: true,
    });

    expect(next).toBe(second);
  });
});
