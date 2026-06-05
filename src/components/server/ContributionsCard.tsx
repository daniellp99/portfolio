import { cookies } from "next/headers";

import { Contributions } from "@/components/contributions/contributions";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMonthStartInZone } from "@/lib/contributions/calendar-projection";
import {
  buildContributionsMonthFormState,
  contributionsMonthCacheKey,
  getContributionsYearMonthFromCookies,
} from "@/lib/contributions/contributions-month";
import { loadOwnerData } from "@/lib/server/content-load";
import { getGithubContributionsForMonth } from "@/lib/server/github-contributions";

export default async function ContributionsCard() {
  const cookieStore = await cookies();
  const ownerData = loadOwnerData();
  const login = ownerData.githubUser.trim();

  const { year, month } = getContributionsYearMonthFromCookies(cookieStore);
  const contributionsPromise = getGithubContributionsForMonth(
    login,
    year,
    month,
  );

  if (!login) {
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

  return (
    <>
      <CardHeader className="order-1 px-1 pt-2 xl:px-2">
        <CardTitle className="text-center leading-tight xl:text-lg xl:leading-normal">
          <Contributions.Title />
        </CardTitle>
      </CardHeader>
      <CardFooter className="peer/contribution-calendar order-3 items-end justify-between px-2 pb-2">
        <Contributions.OpenProfileLink login={login} />
        <Contributions.MonthCalendar
          key={contributionsMonthCacheKey(year, month)}
          initialState={monthFormInitialState}
          journeyStartAt={ownerData.journeyStartAt}
        />
      </CardFooter>
      <CardContent className="group/contribution-content order-2 flex-1 px-1 xl:px-2">
        <Contributions.Boundary year={year} month={month}>
          <CardDescription className="text-center text-xs">
            <Contributions.Description monthStart={monthStart}>
              <Contributions.Count
                key={contributionsMonthCacheKey(year, month)}
                contributionsPromise={contributionsPromise}
              />
            </Contributions.Description>
          </CardDescription>
          <Contributions.Grid>
            <Contributions.WeeksHeader />
            <Contributions.Cells contributionsPromise={contributionsPromise} />
          </Contributions.Grid>
          <Contributions.Legend />
        </Contributions.Boundary>
      </CardContent>
    </>
  );
}
