import Link from "next/link";
import { Suspense, ViewTransition } from "react";

import { Button } from "@/components/ui/button";

import Logo, { LogoFallback } from "@/components/server/Logo";
import NavBarCenter from "@/components/NavBarCenter";

import { getOwnerData } from "@/lib/server/owner";
import { getProjectSlugs } from "@/lib/server/projects";

export default async function NavBar() {
  const projectsSlugs = await getProjectSlugs();
  const ownerData = await getOwnerData();
  const email = ownerData?.email;
  return (
    <nav
      style={{ viewTransitionName: "persistent-nav" }}
      className="peer relative mt-10 flex h-fit flex-col items-center justify-between gap-8 pb-8 sm:mx-10 sm:mt-0 sm:h-32 sm:flex-row"
    >
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <LogoFallback />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" default="none">
          <Logo />
        </ViewTransition>
      </Suspense>
      <NavBarCenter projectsSlugs={projectsSlugs} />
      <Button
        variant="link"
        className="hidden text-xl/6 sm:block"
        render={<Link href={email ? `mailto:${email}` : "#"} />}
        disabled={!email}
        nativeButton={false}
      >
        Contact
      </Button>
    </nav>
  );
}
