import { beforeEach, describe, expect, it } from "bun:test";

import { CONTRIBUTIONS_TZ } from "./constants";
import {
  buildContributionsMonthApiUrl,
  clearContributionsPromiseCache,
  contributionsMonthCacheKey,
  getContributionsPromise,
  parseGithubContributionMonthResponse,
} from "./fetch-month";

const validMonthPayload = {
  year: 2024,
  month: 1,
  calendar: {
    totalContributions: 0,
    weeks: [] as {
      contributionDays: { date: string; contributionCount: number }[];
    }[],
  },
  restrictedContributionsCount: 0,
};

beforeEach(() => {
  clearContributionsPromiseCache();
});

describe("buildContributionsMonthApiUrl", () => {
  it("sets year, month, and explicit tz", () => {
    expect(buildContributionsMonthApiUrl(2024, 3)).toBe(
      "/api/github/contributions?year=2024&month=3&tz=UTC",
    );
  });

  it("encodes non-default tz", () => {
    const url = buildContributionsMonthApiUrl(2024, 1, "America/New_York");
    expect(url).toContain("tz=America%2FNew_York");
  });
});

describe("contributionsMonthCacheKey", () => {
  it("includes time zone", () => {
    expect(contributionsMonthCacheKey(2024, 1)).toBe(
      `2024-1-${CONTRIBUTIONS_TZ}`,
    );
  });
});

describe("parseGithubContributionMonthResponse", () => {
  it("accepts valid payload", () => {
    const data = parseGithubContributionMonthResponse(validMonthPayload);
    expect(data.year).toBe(2024);
    expect(data.month).toBe(1);
  });

  it("throws on invalid payload", () => {
    expect(() =>
      parseGithubContributionMonthResponse({ invalid: true }),
    ).toThrow(/Invalid contributions response/);
  });
});

describe("getContributionsPromise", () => {
  it("reuses cached promise for same key", async () => {
    const json = { ...validMonthPayload, weeks: [] };
    const fetchImpl = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(json),
      } as Response);

    const mockFetch = fetchImpl as unknown as typeof fetch;
    const a = getContributionsPromise(2024, 1, CONTRIBUTIONS_TZ, mockFetch);
    const b = getContributionsPromise(2024, 1, CONTRIBUTIONS_TZ, mockFetch);
    expect(a).toBe(b);
    await a;
  });

  it("clearContributionsPromiseCache allows a new fetch", async () => {
    let calls = 0;
    const json = { ...validMonthPayload, weeks: [] };
    const fetchImpl = () => {
      calls += 1;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(json),
      } as Response);
    };

    const mockFetch = fetchImpl as unknown as typeof fetch;
    await getContributionsPromise(2024, 2, CONTRIBUTIONS_TZ, mockFetch);
    expect(calls).toBe(1);
    clearContributionsPromiseCache();
    await getContributionsPromise(2024, 2, CONTRIBUTIONS_TZ, mockFetch);
    expect(calls).toBe(2);
  });
});
