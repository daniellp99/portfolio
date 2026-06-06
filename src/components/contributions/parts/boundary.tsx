"use client";

import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
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
  const [attempt, setAttempt] = useState(0);
  const [displayMonth, setDisplayMonth] = useState({ year, month });
  const serverMonthRef = useRef({ year, month });

  useEffect(() => {
    const prev = serverMonthRef.current;
    if (prev.year === year && prev.month === month) return;

    serverMonthRef.current = { year, month };
    setDisplayMonth({ year, month });
    setAttempt(0);
  }, [year, month]);

  const value = useMemo<ContributionsBoundaryValue>(
    () => ({
      year: displayMonth.year,
      month: displayMonth.month,
      attempt,
      retryPending,
      setOptimisticMonth: (nextYear, nextMonth) => {
        setDisplayMonth({ year: nextYear, month: nextMonth });
      },
      retry: () => {
        const { year: retryYear, month: retryMonth } = displayMonth;
        startTransition(() => {
          void changeContributionsMonth({
            year: retryYear,
            month: retryMonth,
          }).then(() => {
            setAttempt((current) => current + 1);
          });
        });
      },
    }),
    [attempt, displayMonth, retryPending],
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
