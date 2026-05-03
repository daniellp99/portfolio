import { getOwnerData } from "@/lib/server/owner";

import ContributionsCardClient from "@/components/ContributionsCardClient";
import { CardHeader, CardTitle } from "@/components/ui/card";

function buildYearOptions(startIso: string) {
  const startYear = new Date(startIso).getUTCFullYear();
  const currentYear = new Date().getUTCFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= startYear; y -= 1) years.push(y);
  return { years, defaultYear: currentYear };
}

export default async function ContributionsCard() {
  const owner = await getOwnerData();
  const login = owner?.githubUser?.trim();

  if (!owner || !login) {
    return (
      <CardHeader className="h-full place-content-center place-items-center justify-evenly">
        <CardTitle>No GitHub Username</CardTitle>
      </CardHeader>
    );
  }

  const { years, defaultYear } = buildYearOptions(owner.journeyStartAt);

  return (
    <ContributionsCardClient
      login={login}
      years={years}
      defaultYear={defaultYear}
    />
  );
}
