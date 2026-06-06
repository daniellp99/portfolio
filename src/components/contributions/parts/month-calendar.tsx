"use client";

import { formatInTimeZone } from "date-fns-tz";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  addTransitionType,
  startTransition,
  useActionState,
  useOptimistic,
  type SubmitEvent,
} from "react";

import { useContributionsBoundary } from "@/components/contributions/parts/boundary";
import { Button } from "@/components/ui/button";
import { capture } from "@/lib/analytics";

import { changeContributionsMonthFormAction } from "@/lib/actions/change-contributions-month-form";
import { getMonthStartInZone } from "@/lib/contributions/calendar-projection";
import {
  stepContributionsMonthFormState,
  type ContributionsMonthFormState,
} from "@/lib/contributions/contributions-month";
import { CONTRIBUTIONS_TZ } from "@/lib/site/constants";

function formDataFromSubmit(event: SubmitEvent<HTMLFormElement>): FormData {
  const submitter = event.nativeEvent.submitter;
  return new FormData(
    event.currentTarget,
    submitter instanceof HTMLButtonElement ? submitter : undefined,
  );
}

export function ContributionsMonthCalendar({
  initialState,
  journeyStartAt,
}: {
  initialState: ContributionsMonthFormState;
  journeyStartAt: string;
}) {
  const [state, formAction, isPending] = useActionState(
    changeContributionsMonthFormAction,
    initialState,
  );
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (_current, next: ContributionsMonthFormState) => next,
  );
  const { setOptimisticMonth } = useContributionsBoundary();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = formDataFromSubmit(event);
    const intent = formData.get("intent");
    if (intent !== "prev" && intent !== "next") return;

    const next = stepContributionsMonthFormState(
      optimisticState,
      intent,
      journeyStartAt,
    );
    if (!next) return;

    capture("contributions_month_changed", {
      year: next.year,
      month: next.month,
      direction: intent,
    });

    startTransition(() => {
      addTransitionType(intent === "next" ? "nav-forward" : "nav-back");
      setOptimisticMonth(next.year, next.month);
      setOptimisticState(next);
      formAction(formData);
    });
  }

  const { year, month, caption, canGoPrev, canGoNext } = optimisticState;

  const monthStart = getMonthStartInZone(year, month, CONTRIBUTIONS_TZ);
  const monthShort = formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "MMM");
  const yearLabel = formatInTimeZone(monthStart, CONTRIBUTIONS_TZ, "yyyy");
  const monthIso = `${year}-${String(month).padStart(2, "0")}`;

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      aria-label="Change contributions month"
      aria-busy={isPending || undefined}
      data-pending={isPending || undefined}
      className="cancelDrag group/calendar flex h-10 items-center rounded-full bg-input px-1"
    >
      <Button
        type="submit"
        name="intent"
        value="prev"
        variant="ghost"
        size="icon"
        disabled={!canGoPrev}
        aria-label="Go to the previous month"
        className="size-8.5"
      >
        <ChevronLeftIcon className="size-5" aria-hidden="true" />
      </Button>
      <div role="status" aria-live="polite" aria-atomic="true">
        <span className="sr-only">{caption}</span>
        <time
          dateTime={monthIso}
          aria-hidden="true"
          className="hidden text-sm leading-4 font-medium whitespace-nowrap select-none xl:inline"
        >
          {caption}
        </time>
        <time
          dateTime={monthIso}
          aria-hidden="true"
          className="flex flex-col items-center justify-center leading-none select-none xl:hidden"
        >
          <span className="text-sm font-medium">{monthShort}</span>
          <span className="text-[10px] font-medium tabular-nums">
            {yearLabel}
          </span>
        </time>
      </div>
      <Button
        type="submit"
        name="intent"
        value="next"
        variant="ghost"
        size="icon"
        disabled={!canGoNext}
        aria-label="Go to the next month"
        className="size-8.5"
      >
        <ChevronRightIcon className="size-5" aria-hidden="true" />
      </Button>
    </form>
  );
}
