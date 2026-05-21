import ContributionsCardClient from "@/components/ContributionsCardClient";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { loadOwnerData } from "@/lib/server/content-load";

function buildYearOptions(startIso: string) {
  const startYear = new Date(startIso).getUTCFullYear();
  const currentYear = new Date().getUTCFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= startYear; y -= 1) years.push(y);
  return { years, defaultYear: currentYear };
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

  return (
    <ContributionsCardClient
      login={login}
      years={years}
      defaultYear={defaultYear}
    />
  );
}
