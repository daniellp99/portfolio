"use client";

import { formatInTimeZone } from "date-fns-tz";
import { useOptimistic, useTransition } from "react";
import { TZDate } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";

import { changeContributionsMonth } from "@/lib/actions/change-contributions-month";
import { contributionsYearMonthFromDateInZone } from "@/lib/contributions/contributions-month";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";

export function ContributionsMonthCalendar({
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
    const { year: nextYear, month: nextMonth } =
      contributionsYearMonthFromDateInZone(next, CONTRIBUTIONS_TZ);
    const normalized = new TZDate(nextYear, nextMonth - 1, 1, CONTRIBUTIONS_TZ);

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
      timeZone={CONTRIBUTIONS_TZ}
      onMonthChange={setMonthFrom}
      onNextClick={setMonthFrom}
      onPrevClick={setMonthFrom}
      startMonth={calendarStartMonth}
      endMonth={calendarEndMonth}
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
