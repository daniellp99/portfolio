"use client";

import { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useContributionsBoundary } from "@/components/contributions/parts/boundary";

import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

function CountValue({
  contributionsPromise,
}: {
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const data = use(contributionsPromise);

  return <span>{data.calendar.totalContributions}</span>;
}

export function ContributionsCount({
  cacheKey,
  contributionsPromise,
}: {
  cacheKey: string;
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const { attempt } = useContributionsBoundary();

  return (
    <ErrorBoundary
      resetKeys={[cacheKey, attempt, contributionsPromise]}
      fallbackRender={() => <span>0</span>}
    >
      <Suspense fallback={<span>0</span>}>
        <CountValue
          key={cacheKey}
          contributionsPromise={contributionsPromise}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
