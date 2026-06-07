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
  attempt: number;
  retryPending: boolean;
  retry: () => void;
  setOptimisticMonth: (year: number, month: number) => void;
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
  const [optimisticMonth, setOptimisticMonth] = useState<{
    year: number;
    month: number;
  } | null>(null);

  if (prevServerMonth.year !== year || prevServerMonth.month !== month) {
    setPrevServerMonth({ year, month });
    setAttempt(0);
    setOptimisticMonth(null);
  }

  const displayYear = optimisticMonth?.year ?? year;
  const displayMonth = optimisticMonth?.month ?? month;

  const value = useMemo<ContributionsBoundaryValue>(
    () => ({
      year: displayYear,
      month: displayMonth,
      attempt,
      retryPending,
      setOptimisticMonth: (nextYear, nextMonth) => {
        setOptimisticMonth({ year: nextYear, month: nextMonth });
      },
      retry: () => {
        startTransition(() => {
          void changeContributionsMonth({
            year: displayYear,
            month: displayMonth,
          }).then(() => {
            setAttempt((current) => current + 1);
          });
        });
      },
    }),
    [attempt, displayMonth, displayYear, retryPending],
  );

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
