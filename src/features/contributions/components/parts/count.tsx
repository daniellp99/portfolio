"use client";

import { catchError } from "next/error";
import { Suspense, use, useDeferredValue } from "react";

import { useContributionsBoundary } from "@/features/contributions/components/parts/boundary";
import { getClientCachedContributionsPromise } from "@/features/contributions/lib/contributions-promise-cache";
import { isCurrentContributionsMonth } from "@/features/contributions/lib/contributions-month";
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
  const { year, month, attempt } = useContributionsBoundary();
  const stablePromise = getClientCachedContributionsPromise(
    `${cacheKey}:${attempt}`,
    contributionsPromise,
    { bust: isCurrentContributionsMonth(year, month) },
  );
  const deferredPromise = useDeferredValue(stablePromise);
  const isStale = deferredPromise !== stablePromise;

  return (
    <span
      className={cn(isStale && CONTRIBUTIONS_PENDING_PULSE_CLASS)}
      data-pending={isStale || undefined}
      data-month-key={cacheKey}
    >
      <ContributionsCountErrorBoundary key={attempt}>
        <Suspense fallback={<span>0</span>}>
          <CountValue contributionsPromise={deferredPromise} />
        </Suspense>
      </ContributionsCountErrorBoundary>
    </span>
  );
}
