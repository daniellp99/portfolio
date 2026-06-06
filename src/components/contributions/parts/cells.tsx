"use client";

import { Suspense, ViewTransition, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useContributionsBoundary } from "@/components/contributions/parts/boundary";
import { ContributionsCellTransition } from "@/components/contributions/parts/cell-transition";
import { ContributionsErrorCells } from "@/components/contributions/parts/error-cells";
import { ContributionsLoadingCells } from "@/components/contributions/parts/loading-cells";

export function ContributionsCells({ children }: { children: ReactNode }) {
  const { year, month, retryNonce } = useContributionsBoundary();
  const monthKey = `${year}-${month}`;

  return (
    <ContributionsCellTransition monthKey={monthKey}>
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
              <ViewTransition exit="slide-down" default="none">
                <ContributionsLoadingCells year={year} month={month} />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              {children}
            </ViewTransition>
          </Suspense>
        </ErrorBoundary>
      </section>
    </ContributionsCellTransition>
  );
}
