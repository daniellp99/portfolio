"use client";

import { catchError } from "next/error";
import { Suspense, use, useDeferredValue } from "react";

import { useContributionsBoundary } from "@/features/contributions/components/parts/boundary";
import { CONTRIBUTIONS_PENDING_PULSE_CLASS } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

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
  // Stale-while-revalidate: keep the previous count visible until the new
  // promise is ready (React shows prior UI while the deferred render suspends).
  const deferredPromise = useDeferredValue(contributionsPromise);
  const isStale = deferredPromise !== contributionsPromise;

  return (
    <span
      className={cn(isStale && CONTRIBUTIONS_PENDING_PULSE_CLASS)}
      data-pending={isStale || undefined}
    >
      <ContributionsCountErrorBoundary key={`${cacheKey}-${attempt}`}>
        <Suspense fallback={<span>0</span>}>
          <CountValue contributionsPromise={deferredPromise} />
        </Suspense>
      </ContributionsCountErrorBoundary>
    </span>
  );
}
