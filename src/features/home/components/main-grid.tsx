import { cookies, headers } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AvatarMarker } from "@/components/avatar-marker";
import ThemeToggle from "@/components/ThemeToggle";

import {
  ContributionsCard,
  ContributionsCardSkeleton,
} from "@/features/contributions/components/contributions-card";
import { getGithubContributionsForMonth } from "@/features/contributions/contributions-queries";
import { getContributionsYearMonthFromCookies } from "@/features/contributions/lib/contributions-month";
import { GridContainer } from "@/features/home/components/grid-container";
import { Map } from "@/features/home/components/map";
import { getLayouts } from "@/features/home/home-queries";
import { AboutMe } from "@/features/owner/components/about-me";
import { SkillsCard } from "@/features/owner/components/skills-card";
import { getOwnerData } from "@/features/owner/owner-queries";
import {
  ProjectCard,
  ProjectCardSkeleton,
} from "@/features/projects/components/project-card";
import { getProjectSlugs } from "@/features/projects/projects-queries";
import { AVATAR_MARKER_ROOT_ID } from "@/lib/site/avatar-marker";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import {
  applyResizePolicyToLayouts,
  generateLayouts,
  gridSectionInitialWidth,
  mainGridAllowedLayoutIds,
} from "@/lib/site/grid";
import { gridInitialWidthFromHeaders } from "@/lib/site/viewport-from-headers";

async function ContributionsCardLoader() {
  // Request-time: default month uses wall-clock "now" when the cookie is absent.
  await connection();
  const cookieStore = await cookies();
  const ownerData = getOwnerData();
  const login = ownerData.githubUser.trim();
  const { year, month } = getContributionsYearMonthFromCookies(cookieStore);

  const contributionsPromise = login
    ? getGithubContributionsForMonth(login, year, month)
    : null;

  return (
    <ContributionsCard
      year={year}
      month={month}
      contributionsPromise={contributionsPromise}
    />
  );
}

function MapCardSkeleton() {
  return <Skeleton className="size-full" />;
}

function MapCard({ tooltip }: { tooltip: string }) {
  return (
    <Map.Root>
      <Map.Tiles />
      <Map.ZoomControls />
      <AvatarMarker markerRootId={AVATAR_MARKER_ROOT_ID} tooltip={tooltip} />
    </Map.Root>
  );
}

export async function MainGrid() {
  const [headerList, cookieStore, projectSlugs] = await Promise.all([
    headers(),
    cookies(),
    getProjectSlugs(),
  ]);

  const ownerData = getOwnerData();
  const layouts = getLayouts(
    { layoutKey: MAIN_LAYOUTS_KEY, projectSlugs },
    cookieStore,
  );
  const allowedLayoutIds = mainGridAllowedLayoutIds(projectSlugs);

  return (
    <GridContainer
      layouts={layouts}
      layoutKey={MAIN_LAYOUTS_KEY}
      ssrInitialWidth={gridInitialWidthFromHeaders(headerList)}
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
        <Suspense fallback={<MapCardSkeleton />}>
          <MapCard tooltip={ownerData.avatarMarkerTooltip} />
        </Suspense>
      </Card>
      <Card variant="item" key="contributions" className="flex flex-col">
        <Suspense fallback={<ContributionsCardSkeleton />}>
          <ContributionsCardLoader />
        </Suspense>
      </Card>
      {projectSlugs.map((projectSlug, index) => (
        <Card variant="item" key={projectSlug}>
          <Suspense fallback={<ProjectCardSkeleton />}>
            <ProjectCard projectSlug={projectSlug} priority={index === 0} />
          </Suspense>
        </Card>
      ))}
    </GridContainer>
  );
}

/** Default desktop estimate — no request headers, so the shell stays prerenderable. */
const SKELETON_VIEWPORT_WIDTH = 1350;

export async function MainGridSkeleton() {
  const projectSlugs = await getProjectSlugs();
  const layouts = applyResizePolicyToLayouts(
    generateLayouts("All", projectSlugs),
    MAIN_LAYOUTS_KEY,
  );
  const allowedLayoutIds = mainGridAllowedLayoutIds(projectSlugs);

  return (
    <GridContainer
      layouts={layouts}
      layoutKey={MAIN_LAYOUTS_KEY}
      ssrInitialWidth={gridSectionInitialWidth(SKELETON_VIEWPORT_WIDTH)}
      allowedLayoutIds={allowedLayoutIds}
    >
      <Card variant="item" key="me">
        <Skeleton className="size-full" />
      </Card>
      <Card variant="item" key="toggle-theme">
        <Skeleton className="size-full" />
      </Card>
      <Card variant="item" key="skills">
        <Skeleton className="size-full" />
      </Card>
      <Card variant="item" key="maps">
        <MapCardSkeleton />
      </Card>
      <Card variant="item" key="contributions" className="flex flex-col">
        <ContributionsCardSkeleton />
      </Card>
      {projectSlugs.map((projectSlug) => (
        <Card variant="item" key={projectSlug}>
          <ProjectCardSkeleton />
        </Card>
      ))}
    </GridContainer>
  );
}
