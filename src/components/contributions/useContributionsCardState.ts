"use client";

import { getMonth, getYear, startOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useOptimistic, useState, useTransition } from "react";

import { CONTRIBUTIONS_TZ } from "@/lib/contributions/constants";
import { evictContributionsMonthCache } from "@/lib/contributions/fetch-month";

export function useContributionsCardState({
  years,
  defaultYear,
}: {
  years: number[];
  defaultYear: number;
}) {
  const minYear = years[years.length - 1] ?? defaultYear;
  const maxYear = years[0] ?? defaultYear;
  const calendarStartMonth = toZonedTime(
    new Date(Date.UTC(minYear, 0, 1)),
    CONTRIBUTIONS_TZ,
  );
  const calendarEndMonth = toZonedTime(
    new Date(Date.UTC(maxYear, 11, 1)),
    CONTRIBUTIONS_TZ,
  );
  const initialMonth = startOfMonth(toZonedTime(new Date(), CONTRIBUTIONS_TZ));

  const [month, setMonth] = useState(initialMonth);
  const [optimisticMonth, setOptimisticMonth] = useOptimistic(month);
  const [, startTransition] = useTransition();
  const [retryNonce, setRetryNonce] = useState(0);
  const year = getYear(optimisticMonth);
  const monthNumber = getMonth(optimisticMonth) + 1;

  function setMonthFrom(next: Date) {
    startTransition(() => {
      const normalized = startOfMonth(toZonedTime(next, CONTRIBUTIONS_TZ));
      setOptimisticMonth(normalized);
      setMonth(normalized);
    });
  }

  function retry() {
    evictContributionsMonthCache(year, monthNumber);
    setRetryNonce((n) => n + 1);
  }

  return {
    optimisticMonth,
    setMonthFrom,
    year,
    monthNumber,
    retry,
    errorBoundaryResetKey: `${year}-${monthNumber}-${retryNonce}`,
    calendarStartMonth,
    calendarEndMonth,
  };
}
