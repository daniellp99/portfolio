import Link from "next/link";

import { Button } from "@/components/ui/button";

import NavItems from "./NavItems";
import Logo from "./Logo";

export default function NavBar({
  projectKeys,
  lightLogo,
  darkLogo,
}: {
  projectKeys: string[];
  lightLogo: string | undefined;
  darkLogo: string | undefined;
}) {
  return (
    <nav className=" mt-10 flex h-fit flex-col items-center justify-between gap-8 pb-8 sm:mx-10 sm:mt-0 sm:h-32 sm:flex-row">
      <Logo ownerLightLogo={lightLogo} ownerDarkLogo={darkLogo} />
      <NavItems projectKeys={projectKeys} />
      <Button asChild variant="link" className="hidden sm:block">
        <Link href="mailto:dalejandrolp99@gmail.com" className="text-xl/6">
          Contact
        </Link>
      </Button>
    </nav>
  );
}
