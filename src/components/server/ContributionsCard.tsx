import { Suspense } from "react";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import ContributionsCardClient from "@/components/ContributionsCardClient";
import {
  contributionsYearMonthFromDate,
  getCurrentContributionsMonthInZone,
} from "@/lib/contributions/initial-month";
import { loadOwnerData } from "@/lib/server/content-load";
import { getGithubContributionsForMonth } from "@/lib/server/github-contributions";

function buildYearOptions(startIso: string) {
  const startYear = new Date(startIso).getUTCFullYear();
  const currentYear = new Date().getUTCFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= startYear; y -= 1) years.push(y);
  return { years, defaultYear: currentYear };
}

function ContributionsCardFallback() {
  return <Skeleton className="size-full" />;
}

export default function ContributionsCard() {
  const ownerData = loadOwnerData();
  const login = ownerData.githubUser.trim();

  if (!login) {
    return (
      <CardHeader className="h-full place-content-center place-items-center justify-evenly">
        <CardTitle>No GitHub Username</CardTitle>
      </CardHeader>
    );
  }

  const { years, defaultYear } = buildYearOptions(ownerData.journeyStartAt);
  const { year, month } = contributionsYearMonthFromDate(
    getCurrentContributionsMonthInZone(),
  );
  const initialContributionsPromise = getGithubContributionsForMonth(
    login,
    year,
    month,
  );

  return (
    <Suspense fallback={<ContributionsCardFallback />}>
      <ContributionsCardClient
        login={login}
        years={years}
        defaultYear={defaultYear}
        initialContributionsPromise={initialContributionsPromise}
      />
    </Suspense>
  );
}
