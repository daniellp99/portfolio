import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";

import Logo, { LogoFallback } from "@/components/Logo";
import NavItems, { NavItemsFallback } from "@/components/NavItems";

import { getProjectSlugs } from "@/server/projects";

export default async function NavBar() {
  const projectsSlugs = await getProjectSlugs();
  return (
    <nav className="peer mt-10 flex h-fit flex-col items-center justify-between gap-8 pb-8 sm:mx-10 sm:mt-0 sm:h-32 sm:flex-row">
      <Suspense fallback={<LogoFallback />}>
        <Logo />
      </Suspense>
      <Suspense fallback={<NavItemsFallback />}>
        <NavItems projectsSlugs={projectsSlugs} />
      </Suspense>
      <Button
        variant="link"
        className="hidden text-xl/6 sm:block"
        render={<Link href="mailto:dalejandrolp99@gmail.com" />}
        nativeButton={false}
      >
        Contact
      </Button>
    </nav>
  );
}
