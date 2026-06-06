"use client";

import { use } from "react";

import { ContributionsDataCells } from "@/components/contributions/parts/data-cells";

import { buildContributionHeatmapCells } from "@/lib/contributions/calendar-projection";
import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

export function ContributionsDataCellsAsync({
  contributionsPromise,
}: {
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const data = use(contributionsPromise);
  const cells = buildContributionHeatmapCells(data);

  return <ContributionsDataCells cells={cells} />;
}
