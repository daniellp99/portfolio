"use client";

import { catchError, type ErrorInfo } from "next/error";
import { Suspense, useDeferredValue, ViewTransition } from "react";

import { useContributionsBoundary } from "@/features/contributions/components/parts/boundary";
import { ContributionsCellTransition } from "@/features/contributions/components/parts/cell-transition";
import { ContributionsDataCellsAsync } from "@/features/contributions/components/parts/data-cells-async";
import { ContributionsErrorCells } from "@/features/contributions/components/parts/error-cells";
import { ContributionsLoadingCells } from "@/features/contributions/components/parts/loading-cells";
import { CONTRIBUTIONS_PENDING_PULSE_CLASS } from "@/lib/site/constants";
import { cn } from "@/lib/utils";

import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

const ContributionsCellsErrorBoundary = catchError(
  function ContributionsCellsErrorFallback(
    { year, month }: { year: number; month: number },
    { error }: ErrorInfo,
  ) {
    return (
      <ContributionsErrorCells
        year={year}
        month={month}
        error={error instanceof Error ? error : new Error(String(error))}
      />
    );
  },
);

export function ContributionsCells({
  cacheKey,
  contributionsPromise,
}: {
  cacheKey: string;
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const { year, month, attempt } = useContributionsBoundary();
  // Keep previous heatmap until the new month promise is ready.
  const deferredPromise = useDeferredValue(contributionsPromise);
  const deferredCacheKey = useDeferredValue(cacheKey);
  const isStale =
    deferredPromise !== contributionsPromise || deferredCacheKey !== cacheKey;
  const monthKey = `${year}-${month}`;

  return (
    <section
      className={cn(
        "grid place-items-stretch [grid-template-areas:'cells']",
        isStale && CONTRIBUTIONS_PENDING_PULSE_CLASS,
      )}
      data-pending={isStale || undefined}
    >
      <ContributionsCellsErrorBoundary
        key={`${deferredCacheKey}-${attempt}`}
        year={year}
        month={month}
      >
        <ContributionsCellTransition monthKey={monthKey}>
          <Suspense
            fallback={
              <ViewTransition exit="slide-down" default="none">
                <ContributionsLoadingCells year={year} month={month} />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              <ContributionsDataCellsAsync
                contributionsPromise={deferredPromise}
              />
            </ViewTransition>
          </Suspense>
        </ContributionsCellTransition>
      </ContributionsCellsErrorBoundary>
    </section>
  );
}
