import React from "react";
import NavItems from "./NavItems";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <nav className="mt-10 flex h-32 flex-col items-center justify-between sm:mx-10 sm:mt-0 sm:flex-row">
      <h1 className="font-sans text-5xl font-extrabold text-gray-800 dark:text-gray-300">
        daniellp
      </h1>
      <NavItems />
      <Link
        className="hidden text-lg hover:text-zinc-500 sm:block"
        href="mailto:dalejandrolp99@gmail.com"
      >
        Contact
      </Link>
    </nav>
  );
}
