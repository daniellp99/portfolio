"use client";

import { useState, useTransition, type ReactNode } from "react";

import { ContributionsErrorBoundary } from "@/components/contributions/ContributionsErrorBoundary";
import { ContributionsErrorFallback } from "@/components/contributions/ContributionsErrorFallback";
import { changeContributionsMonth } from "@/lib/actions/change-contributions-month";

export function ContributionsMonthContent({
  year,
  month,
  children,
}: {
  year: number;
  month: number;
  children: ReactNode;
}) {
  const [retryPending, startTransition] = useTransition();
  const [retryNonce, setRetryNonce] = useState(0);

  function retry() {
    startTransition(async () => {
      await changeContributionsMonth({ year, month });
      setRetryNonce((n) => n + 1);
    });
  }

  return (
    <ContributionsErrorBoundary
      resetKey={`${year}-${month}-${retryNonce}`}
      fallback={({ error, reset }) => (
        <ContributionsErrorFallback
          error={error}
          onRetry={() => {
            reset();
            retry();
          }}
        />
      )}
    >
      <span
        className="peer/retry sr-only"
        data-pending={retryPending || undefined}
        aria-hidden
      />
      {children}
    </ContributionsErrorBoundary>
  );
}
