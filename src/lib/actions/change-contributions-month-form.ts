"use server";

import {
  stepContributionsMonthFormState,
  type ContributionsMonthFormState,
} from "@/lib/contributions/contributions-month";
import { loadOwnerData } from "@/lib/server/content-load";

import { changeContributionsMonth } from "./change-contributions-month";

export type { ContributionsMonthFormState } from "@/lib/contributions/contributions-month";

export async function changeContributionsMonthFormAction(
  prevState: ContributionsMonthFormState,
  formData: FormData,
): Promise<ContributionsMonthFormState> {
  const intent = formData.get("intent");
  if (intent !== "prev" && intent !== "next") {
    return prevState;
  }

  const owner = loadOwnerData();
  const nextState = stepContributionsMonthFormState(
    prevState,
    intent,
    owner.journeyStartAt,
  );
  if (!nextState) {
    return prevState;
  }

  await changeContributionsMonth({
    year: nextState.year,
    month: nextState.month,
  });

  return nextState;
}
