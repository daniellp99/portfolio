"use client";

import { usePathname } from "next/navigation";
import { ReactNode, ViewTransition } from "react";

import GoBackButton from "@/components/GoBackButton";

export default function NavBarCenter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProjectDetail = pathname.startsWith("/project/");

  if (isHome) {
    return (
      <ViewTransition
        key="nav-center-home"
        default="none"
        enter="nav-center-swap"
        exit="nav-center-swap"
      >
        {children}
      </ViewTransition>
    );
  } else if (isProjectDetail) {
    return (
      <ViewTransition
        key="nav-center-project"
        default="none"
        enter="nav-center-swap"
        exit="nav-center-swap"
      >
        <GoBackButton />
      </ViewTransition>
    );
  }
}
