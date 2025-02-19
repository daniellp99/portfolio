import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";

import Logo, { LogoFallback } from "@/components/Logo";
import NavItems, { NavItemsFallback } from "@/components/NavItems";

import { getProjectSlugsDTO } from "@/data/project-dto";

export default function NavBar() {
  const projectsSlugsPromise = getProjectSlugsDTO();
  return (
    <nav className="mt-10 flex h-fit flex-col items-center justify-between gap-8 pb-8 sm:mx-10 sm:mt-0 sm:h-32 sm:flex-row">
      <Suspense fallback={<LogoFallback />}>
        <Logo />
      </Suspense>
      <Suspense fallback={<NavItemsFallback />}>
        <NavItems projectsSlugsPromise={projectsSlugsPromise} />
      </Suspense>
      <Button asChild variant="link" className="hidden sm:block">
        <Link href="mailto:dalejandrolp99@gmail.com" className="text-xl/6">
          Contact
        </Link>
      </Button>
    </nav>
  );
}
