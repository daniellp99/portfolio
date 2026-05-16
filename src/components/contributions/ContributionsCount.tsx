"use client";

import { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";
import { use } from "react";

export function ContributionsCount({
  contributionsPromise,
}: {
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const data = use(contributionsPromise);
  return (
    <span key={`contributions-count`}>{data.calendar.totalContributions}</span>
  );
}
