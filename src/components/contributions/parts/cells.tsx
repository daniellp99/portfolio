"use client";

import { Suspense, ViewTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useContributionsBoundary } from "@/components/contributions/parts/boundary";
import { ContributionsDataCells } from "@/components/contributions/parts/data-cells";
import { ContributionsErrorCells } from "@/components/contributions/parts/error-cells";
import { ContributionsLoadingCells } from "@/components/contributions/parts/loading-cells";

import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

export function ContributionsCells({
  contributionsPromise,
}: {
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const { year, month, retryNonce } = useContributionsBoundary();

  return (
    <section className="grid place-items-stretch [grid-template-areas:'cells']">
      <ErrorBoundary
        resetKeys={[year, month, retryNonce]}
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ContributionsErrorCells
            error={error instanceof Error ? error : new Error(String(error))}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <Suspense
          fallback={
            <ViewTransition exit="slide-down">
              <ContributionsLoadingCells year={year} month={month} />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" default="none">
            <ContributionsDataCells
              contributionsPromise={contributionsPromise}
            />
          </ViewTransition>
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
