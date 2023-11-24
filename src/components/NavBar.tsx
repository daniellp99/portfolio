import React from "react";
import NavItems from "./NavItems";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg mx-10 flex h-36 flex-row items-center justify-between ">
      <h1 className="text-4xl text-violet-500">daniellp</h1>
      <NavItems />
      <Link
        className="text-lg hover:text-gray-500"
        href="mailto:dalejandrolp99@gmail.com"
      >
        Contact
      </Link>
    </nav>
  );
}
