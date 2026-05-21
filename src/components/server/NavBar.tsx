import Link from "next/link";
import { Suspense, ViewTransition } from "react";

import { Button } from "@/components/ui/button";

import NavBarCenter from "@/components/NavBarCenter";
import NavItems, { NavItemsFallback } from "@/components/NavItems";
import Logo from "@/components/server/Logo";

import { loadOwnerData } from "@/lib/server/content-load";
import { getActiveTab } from "@/lib/server/layouts";
import { getProjectSlugs } from "@/lib/server/projects";

export default function NavBar() {
  const projectsSlugsPromise = getProjectSlugs();
  const activeTabPromise = getActiveTab();
  const ownerData = loadOwnerData();

  return (
    <nav
      style={{ viewTransitionName: "persistent-nav" }}
      className="peer relative mt-10 flex h-fit flex-col items-center justify-between gap-8 pb-8 sm:mx-10 sm:mt-0 sm:h-32 sm:flex-row"
    >
      <Logo />
      <NavBarCenter>
        <Suspense
          fallback={
            <ViewTransition exit="slide-down">
              <NavItemsFallback />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" default="none">
            <NavItems
              projectsSlugsPromise={projectsSlugsPromise}
              activeTabPromise={activeTabPromise}
            />
          </ViewTransition>
        </Suspense>
      </NavBarCenter>
      <Button
        variant="link"
        className="hidden text-xl/6 sm:block"
        render={<Link href={`mailto:${ownerData.email}`} />}
        nativeButton={false}
      >
        Contact
      </Button>
    </nav>
  );
}
