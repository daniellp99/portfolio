"use client";

import { usePathname } from "next/navigation";
import { Suspense, ViewTransition } from "react";

import GoBackButton from "@/components/GoBackButton";
import NavItems, { NavItemsFallback } from "@/components/NavItems";
import type { ProjectSlugs } from "@/lib/content/schemas";

export default function NavBarCenter({
  projectsSlugs,
}: {
  projectsSlugs: ProjectSlugs;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProjectDetail = pathname.startsWith("/project/");

  return (
    <div className="flex items-center justify-center">
      {isHome ? (
        <ViewTransition
          key="nav-center-home"
          default="none"
          enter="nav-center-swap"
          exit="nav-center-swap"
        >
          <Suspense
            fallback={
              <ViewTransition exit="slide-down">
                <NavItemsFallback />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              <NavItems projectsSlugs={projectsSlugs} />
            </ViewTransition>
          </Suspense>
        </ViewTransition>
      ) : isProjectDetail ? (
        <ViewTransition
          key="nav-center-project"
          default="none"
          enter="nav-center-swap"
          exit="nav-center-swap"
        >
          <GoBackButton />
        </ViewTransition>
      ) : null}
    </div>
  );
}
