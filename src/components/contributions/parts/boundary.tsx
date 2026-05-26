"use client";

import {
  createContext,
  use,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import { changeContributionsMonth } from "@/lib/actions/change-contributions-month";

type ContributionsBoundaryValue = {
  year: number;
  month: number;
  retryNonce: number;
  retryPending: boolean;
  retry: () => void;
};

const ContributionsBoundaryContext =
  createContext<ContributionsBoundaryValue | null>(null);

export function useContributionsBoundary(): ContributionsBoundaryValue {
  const value = use(ContributionsBoundaryContext);
  if (!value) {
    throw new Error(
      "useContributionsBoundary must be used within <Contributions.Boundary>",
    );
  }
  return value;
}

export function ContributionsBoundary({
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

  const value = useMemo<ContributionsBoundaryValue>(
    () => ({
      year,
      month,
      retryNonce,
      retryPending,
      retry: () => {
        startTransition(async () => {
          await changeContributionsMonth({ year, month });
          setRetryNonce((n) => n + 1);
        });
      },
    }),
    [year, month, retryNonce, retryPending],
  );

  return (
    <ContributionsBoundaryContext value={value}>
      <span
        className="peer/retry sr-only"
        data-pending={retryPending || undefined}
        aria-hidden
      />
      {children}
    </ContributionsBoundaryContext>
  );
}
