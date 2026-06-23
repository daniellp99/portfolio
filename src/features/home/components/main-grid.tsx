import { cookies } from "next/headers";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AvatarMarker } from "@/components/avatar-marker";
import ThemeToggle from "@/components/ThemeToggle";

import { ContributionsCard } from "@/features/contributions/components/contributions-card";
import { getGithubContributionsForMonth } from "@/features/contributions/contributions-queries";
import { getContributionsYearMonthFromCookies } from "@/features/contributions/lib/contributions-month";
import { GridContainer } from "@/features/home/components/grid-container";
import { Map } from "@/features/home/components/map";
import { getLayouts } from "@/features/home/home-queries";
import { AboutMe } from "@/features/owner/components/about-me";
import { SkillsCard } from "@/features/owner/components/skills-card";
import { getOwnerData } from "@/features/owner/owner-queries";
import { ProjectCard } from "@/features/projects/components/project-card";
import { getProjectSlugs } from "@/features/projects/projects-queries";
import { AVATAR_MARKER_ROOT_ID } from "@/lib/site/avatar-marker";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import { mainGridAllowedLayoutIds } from "@/lib/site/grid";

export async function MainGrid() {
  const [cookieStore, projectSlugs] = await Promise.all([
    cookies(),
    getProjectSlugs(),
  ]);

  const ownerData = getOwnerData();
  const login = ownerData.githubUser.trim();
  const { year, month } = getContributionsYearMonthFromCookies(cookieStore);

  const contributionsPromise = login
    ? getGithubContributionsForMonth(login, year, month)
    : null;

  const layouts = await getLayouts(
    { layoutKey: MAIN_LAYOUTS_KEY },
    cookieStore,
  );

  const allowedLayoutIds = mainGridAllowedLayoutIds(projectSlugs);

  return (
    <GridContainer
      layouts={layouts}
      layoutKey={MAIN_LAYOUTS_KEY}
      allowedLayoutIds={allowedLayoutIds}
    >
      <Card variant="item" key="me">
        <AboutMe />
      </Card>
      <Card variant="item" key="toggle-theme">
        <ThemeToggle />
      </Card>
      <Card variant="item" key="skills">
        <SkillsCard />
      </Card>
      <Card variant="item" key="maps">
        <Map.Root>
          <Map.Tiles />
          <Map.ZoomControls />
          <AvatarMarker
            markerRootId={AVATAR_MARKER_ROOT_ID}
            tooltip={ownerData.avatarMarkerTooltip}
          />
        </Map.Root>
      </Card>
      <Card variant="item" key="contributions" className="flex flex-col">
        <ContributionsCard
          year={year}
          month={month}
          contributionsPromise={contributionsPromise}
        />
      </Card>
      {projectSlugs.map((projectSlug) => (
        <Card variant="item" key={projectSlug}>
          <ProjectCard projectSlug={projectSlug} />
        </Card>
      ))}
    </GridContainer>
  );
}

export function MainGridSkeleton() {
  return (
    <div className="mx-auto grid max-w-[375px] grid-cols-2 gap-[15.5px] p-[15.5px] md:max-w-[800px] md:grid-cols-4 md:gap-4 xl:max-w-[1200px]">
      <Skeleton className="col-span-full row-span-full h-86 sm:col-span-2 sm:row-span-2 sm:h-94 xl:row-auto xl:h-69" />
      <Skeleton className="col-span-2 h-40 sm:col-auto sm:h-45 xl:h-69" />
      <Skeleton className="row-span-2 h-full" />
      <Skeleton className="h-40 sm:h-45 xl:h-69" />
      <Skeleton className="h-40 sm:h-45 xl:h-69" />
    </div>
  );
}
