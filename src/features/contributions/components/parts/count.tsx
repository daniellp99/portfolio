"use client";

import { catchError } from "next/error";
import { Suspense, use } from "react";

import { useContributionsBoundary } from "@/features/contributions/components/parts/boundary";

import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

function CountValue({
  contributionsPromise,
}: {
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const data = use(contributionsPromise);

  return <span>{data.calendar.totalContributions}</span>;
}

const ContributionsCountErrorBoundary = catchError(
  function CountErrorFallback() {
    return <span>0</span>;
  },
);

export function ContributionsCount({
  cacheKey,
  contributionsPromise,
}: {
  cacheKey: string;
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const { attempt } = useContributionsBoundary();

  return (
    <ContributionsCountErrorBoundary key={`${cacheKey}-${attempt}`}>
      <Suspense fallback={<span>0</span>}>
        <CountValue
          key={cacheKey}
          contributionsPromise={contributionsPromise}
        />
      </Suspense>
    </ContributionsCountErrorBoundary>
  );
}
