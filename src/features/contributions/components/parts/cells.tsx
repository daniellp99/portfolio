"use client";

import { Suspense, ViewTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useContributionsBoundary } from "@/features/contributions/components/parts/boundary";
import { ContributionsCellTransition } from "@/features/contributions/components/parts/cell-transition";
import { ContributionsDataCellsAsync } from "@/features/contributions/components/parts/data-cells-async";
import { ContributionsErrorCells } from "@/features/contributions/components/parts/error-cells";
import { ContributionsLoadingCells } from "@/features/contributions/components/parts/loading-cells";

import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

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
