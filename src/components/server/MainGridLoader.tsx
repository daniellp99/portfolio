import { cookies } from "next/headers";
import { Suspense, ViewTransition } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import MainGrid from "@/components/server/MainGrid";

import { getLayouts } from "@/lib/server/layouts";
import { getProjectSlugs } from "@/lib/server/projects";
import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";

function MainGridFallback() {
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

export default async function MainGridLoader() {
  const cookieStore = await cookies();
  const projectsSlugsPromise = getProjectSlugs();
  const layoutsPromise = getLayouts(
    {
      layoutKey: MAIN_LAYOUTS_KEY,
    },
    cookieStore,
  );

  return (
    <Suspense
      fallback={
        <ViewTransition exit="slide-down">
          <MainGridFallback />
        </ViewTransition>
      }
    >
      <ViewTransition enter="slide-up" default="none">
        <MainGrid
          projectsSlugsPromise={projectsSlugsPromise}
          layoutsPromise={layoutsPromise}
        />
      </ViewTransition>
    </Suspense>
  );
}
