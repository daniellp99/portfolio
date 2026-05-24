"use client";

import { formatInTimeZone } from "date-fns-tz";
import { useOptimistic, useTransition } from "react";

import { Calendar } from "@/components/ui/calendar";

import { changeContributionsMonth } from "@/lib/actions/change-contributions-month";
import { normalizeContributionsMonth } from "@/lib/contributions/contributions-month";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";

export function ContributionsCalendar({
  initialMonth,
  calendarStartMonth,
  calendarEndMonth,
}: {
  initialMonth: Date;
  calendarStartMonth: Date;
  calendarEndMonth: Date;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticMonth, setOptimisticMonth] = useOptimistic(
    initialMonth,
    (_current, next: Date) => next,
  );

  function setMonthFrom(next: Date) {
    const normalized = normalizeContributionsMonth(next);
    const nextYear = Number(
      formatInTimeZone(normalized, CONTRIBUTIONS_TZ, "y"),
    );
    const nextMonth = Number(
      formatInTimeZone(normalized, CONTRIBUTIONS_TZ, "M"),
    );

    startTransition(async () => {
      setOptimisticMonth(normalized);
      await changeContributionsMonth({ year: nextYear, month: nextMonth });
    });
  }

  return (
    <Calendar
      data-pending={isPending || undefined}
      captionLayout="label"
      formatters={{
        formatCaption: (date) =>
          formatInTimeZone(date, CONTRIBUTIONS_TZ, "MMM yyyy"),
      }}
      mode="single"
      month={optimisticMonth}
      onMonthChange={setMonthFrom}
      onNextClick={setMonthFrom}
      onPrevClick={setMonthFrom}
      startMonth={calendarStartMonth}
      endMonth={calendarEndMonth}
      timeZone={CONTRIBUTIONS_TZ}
      classNames={{
        table: "hidden",
        weekdays: "hidden",
        week: "hidden",
        month: "gap-0",
        caption_label: "text-center leading-4",
      }}
      className="cancelDrag rounded-sm bg-input p-1"
    />
  );
}
