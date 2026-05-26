"use client";

import { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useContributionsBoundary } from "@/components/contributions/parts/boundary";
import { CountingNumber } from "@/components/ui/counting-number";

import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

function CountValue({
  contributionsPromise,
}: {
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const data = use(contributionsPromise);

  return (
    <CountingNumber
      number={data.calendar.totalContributions}
      fromNumber={0}
      transition={{
        stiffness: 100,
        damping: 32,
        duration: 0.3,
      }}
    />
  );
}

export function ContributionsCount({
  contributionsPromise,
}: {
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const { year, month, retryNonce } = useContributionsBoundary();

  return (
    <ErrorBoundary
      resetKeys={[year, month, retryNonce]}
      fallbackRender={() => <span>0</span>}
    >
      <Suspense fallback={<span>0</span>}>
        <CountValue contributionsPromise={contributionsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}
