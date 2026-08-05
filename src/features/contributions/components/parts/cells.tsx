"use client";

import { catchError, type ErrorInfo } from "next/error";
import { Suspense, ViewTransition } from "react";

import { useContributionsBoundary } from "@/features/contributions/components/parts/boundary";
import { ContributionsCellTransition } from "@/features/contributions/components/parts/cell-transition";
import { ContributionsDataCellsAsync } from "@/features/contributions/components/parts/data-cells-async";
import { ContributionsErrorCells } from "@/features/contributions/components/parts/error-cells";
import { ContributionsLoadingCells } from "@/features/contributions/components/parts/loading-cells";

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
  const monthKey = `${year}-${month}`;

  return (
    <section className="grid place-items-stretch [grid-template-areas:'cells']">
      <ContributionsCellsErrorBoundary
        key={`${cacheKey}-${attempt}`}
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
                key={cacheKey}
                contributionsPromise={contributionsPromise}
              />
            </ViewTransition>
          </Suspense>
        </ContributionsCellTransition>
      </ContributionsCellsErrorBoundary>
    </section>
  );
}
