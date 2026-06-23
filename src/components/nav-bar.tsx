import Link from "next/link";

import { Button } from "@/components/ui/button";

import NavBarCenter from "@/components/NavBarCenter";
import { Logo } from "@/features/owner/components/logo";

export function NavBar({
  children,
  contactEmail,
}: {
  children: React.ReactNode;
  contactEmail: string;
}) {
  return (
    <nav
      style={{ viewTransitionName: "persistent-nav" }}
      className="peer relative mt-10 flex h-fit flex-col items-center justify-between gap-8 pb-8 sm:mx-10 sm:mt-0 sm:h-32 sm:flex-row"
    >
      <Logo />
      <NavBarCenter>{children}</NavBarCenter>
      <Button
        variant="link"
        className="hidden text-xl/6 sm:block"
        render={<Link href={`mailto:${contactEmail}`} />}
        nativeButton={false}
      >
        Contact
      </Button>
    </nav>
  );
}
