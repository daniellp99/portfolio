import Link from "next/link";

import { Button } from "@/components/ui/button";

import NavItems from "./NavItems";

export default function NavBar() {
  return (
    <nav className="mt-10 flex h-32 flex-col items-center justify-between sm:mx-10 sm:mt-0 sm:flex-row">
      <h1 className="font-sans text-5xl font-extrabold text-gray-800 dark:text-gray-300">
        daniellp
      </h1>
      <NavItems />
      <Button asChild variant="link" className="hidden sm:block">
        <Link href="mailto:dalejandrolp99@gmail.com" className="text-xl">
          Contact
        </Link>
      </Button>
    </nav>
  );
}
