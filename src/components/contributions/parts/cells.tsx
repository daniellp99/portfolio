"use client";

import { Suspense, ViewTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useContributionsBoundary } from "@/components/contributions/parts/boundary";
import { ContributionsCellTransition } from "@/components/contributions/parts/cell-transition";
import { ContributionsDataCellsAsync } from "@/components/contributions/parts/data-cells-async";
import { ContributionsErrorCells } from "@/components/contributions/parts/error-cells";
import { ContributionsLoadingCells } from "@/components/contributions/parts/loading-cells";

import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

export function ContributionsCells({
  cacheKey,
  contributionsPromise,
}: {
  cacheKey: string;
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const { year, month, attempt, isNavigating } = useContributionsBoundary();
  const monthKey = `${year}-${month}`;

  if (isNavigating) {
    return (
      <section className="grid place-items-stretch [grid-template-areas:'cells']">
        <ContributionsCellTransition monthKey={monthKey}>
          <ViewTransition exit="slide-down" default="none">
            <ContributionsLoadingCells year={year} month={month} />
          </ViewTransition>
        </ContributionsCellTransition>
      </section>
    );
  }

  return (
    <section className="grid place-items-stretch [grid-template-areas:'cells']">
      <ErrorBoundary
        resetKeys={[cacheKey, attempt, contributionsPromise]}
        fallbackRender={({ error }) => (
          <ContributionsErrorCells
            year={year}
            month={month}
            error={error instanceof Error ? error : new Error(String(error))}
          />
        )}
      >
        <ContributionsCellTransition monthKey={monthKey}>
          <Suspense
            key={cacheKey}
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
      </ErrorBoundary>
    </section>
  );
}
