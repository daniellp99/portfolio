import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Contributions } from "@/features/contributions/components/contributions";
import { getMonthStartInZone } from "@/features/contributions/lib/calendar-projection";
import {
  buildContributionsMonthFormState,
  contributionsMonthCacheKey,
} from "@/features/contributions/lib/contributions-month";
import { getOwnerData } from "@/features/owner/owner-queries";
import type { GithubContributionMonthResponse } from "@/lib/schemas/github-contributions";

export function ContributionsCard({
  year,
  month,
  contributionsPromise,
}: {
  year: number;
  month: number;
  contributionsPromise: Promise<GithubContributionMonthResponse> | null;
}) {
  const ownerData = getOwnerData();
  const login = ownerData.githubUser.trim();

  if (!login || !contributionsPromise) {
    return (
      <CardHeader className="h-full place-content-center place-items-center justify-evenly">
        <CardTitle>No GitHub Username</CardTitle>
      </CardHeader>
    );
  }

  const monthFormInitialState = buildContributionsMonthFormState(
    ownerData.journeyStartAt,
    year,
    month,
  );
  const monthStart = getMonthStartInZone(year, month);
  const cacheKey = contributionsMonthCacheKey(year, month);

  return (
    <>
      <CardHeader className="order-1 px-1 pt-2 xl:px-2">
        <CardTitle className="text-center leading-tight xl:text-lg xl:leading-normal">
          <Contributions.Title />
        </CardTitle>
      </CardHeader>
      <Contributions.Boundary year={year} month={month}>
        <CardFooter className="peer/contribution-calendar order-3 items-end justify-between px-2 pb-2">
          <Contributions.OpenProfileLink login={login} />
          <Contributions.MonthCalendar
            key={cacheKey}
            initialState={monthFormInitialState}
            journeyStartAt={ownerData.journeyStartAt}
          />
        </CardFooter>
        <CardContent className="group/contribution-content order-2 flex-1 px-1 xl:px-2">
          <CardDescription className="text-center text-xs">
            <Contributions.Description monthStart={monthStart}>
              <Contributions.Count
                cacheKey={cacheKey}
                contributionsPromise={contributionsPromise}
              />
            </Contributions.Description>
          </CardDescription>
          <Contributions.Grid>
            <Contributions.WeeksHeader />
            <Contributions.Cells
              cacheKey={cacheKey}
              contributionsPromise={contributionsPromise}
            />
          </Contributions.Grid>
          <Contributions.Legend />
        </CardContent>
      </Contributions.Boundary>
    </>
  );
}
