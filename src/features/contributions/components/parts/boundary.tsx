"use client";

import {
  createContext,
  use,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import { changeContributionsMonth } from "@/features/contributions/contributions-actions";

type ContributionsBoundaryValue = {
  year: number;
  month: number;
  attempt: number;
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
  const [prevServerMonth, setPrevServerMonth] = useState({ year, month });
  const [attempt, setAttempt] = useState(0);

  if (prevServerMonth.year !== year || prevServerMonth.month !== month) {
    setPrevServerMonth({ year, month });
    setAttempt(0);
  }

  const value: ContributionsBoundaryValue = {
    year,
    month,
    attempt,
    retryPending,
    retry: () => {
      startTransition(() => {
        void changeContributionsMonth({ year, month }).then(() => {
          setAttempt((current) => current + 1);
        });
      });
    },
  };

  return (
    <ContributionsBoundaryContext value={value}>
      <span
        className="peer/retry sr-only"
        data-pending={retryPending || undefined}
        aria-hidden
      />
      <div className="contents">{children}</div>
    </ContributionsBoundaryContext>
  );
}
