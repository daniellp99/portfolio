"use client";

import { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";
import { use } from "react";
import { CountingNumber } from "../ui/counting-number";

export function ContributionsCount({
  contributionsPromise,
}: {
  contributionsPromise: Promise<GithubContributionMonthResponse>;
}) {
  const data = use(contributionsPromise);

  return (
    <CountingNumber
      number={data.calendar.totalContributions}
      fromNumber={0}
      transition={{
        stiffness: 100,
        damping: 32,
        duration: 0.3,
      }}
    />
  );
}
