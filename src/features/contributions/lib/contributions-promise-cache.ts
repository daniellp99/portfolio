import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

/**
 * Client-side thenable identity cache for `use()`.
 *
 * Each RSC month navigation still constructs a **new** Promise even when Next
 * `'use cache'` is warm. React's `use()` docs require reusing the same Promise
 * instance across renders — without this map, revisiting a month always
 * suspends on a fresh thenable and can flash the Suspense fallback.
 *
 * This is not a client fetch cache: it only remembers server-provided
 * thenables by month key so resolved months read synchronously.
 */
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
