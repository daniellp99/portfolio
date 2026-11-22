import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

const promiseByKey = new Map<
  string,
  Promise<GithubContributionMonthResponse>
>();

export function getClientCachedContributionsPromise(
  cacheKey: string,
  incoming: Promise<GithubContributionMonthResponse>,
  { bust = false }: { bust?: boolean } = {},
): Promise<GithubContributionMonthResponse> {
  if (bust) {
    promiseByKey.delete(cacheKey);
  }

  const existing = promiseByKey.get(cacheKey);
  if (existing) {
    return existing;
  }

  promiseByKey.set(cacheKey, incoming);
  void incoming.catch(() => {
    if (promiseByKey.get(cacheKey) === incoming) {
      promiseByKey.delete(cacheKey);
    }
  });

  return incoming;
}
