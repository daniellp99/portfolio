"use client";

import { catchError, type ErrorInfo } from "next/error";
import { Suspense, useDeferredValue } from "react";

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
  // Keep showing the previous month's promise until React commits the deferred
  // update. Suspense must stay mounted across month changes — remounting it
  // (via error-boundary / ViewTransition keys) forces LoadingCells even when
  // `'use cache'` already has the month warm (new thenable per RSC render).
  const deferredPromise = useDeferredValue(contributionsPromise);
  const isStale = deferredPromise !== contributionsPromise;

  return (
    <section
      className={cn(
        "grid place-items-stretch [grid-template-areas:'cells']",
        isStale && CONTRIBUTIONS_PENDING_PULSE_CLASS,
      )}
      data-pending={isStale || undefined}
      data-month-key={cacheKey}
    >
      <ContributionsCellsErrorBoundary
        key={attempt}
        year={year}
        month={month}
      >
        <Suspense
          fallback={<ContributionsLoadingCells year={year} month={month} />}
        >
          <ContributionsCellTransition>
            <ContributionsDataCellsAsync
              contributionsPromise={deferredPromise}
            />
          </ContributionsCellTransition>
        </Suspense>
      </ContributionsCellsErrorBoundary>
    </section>
  );
}
