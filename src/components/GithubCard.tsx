"use client";
import { ArrowUpRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";

const GitHubIcon = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Image
      src={
        resolvedTheme === "light"
          ? "/github-mark.png"
          : "/github-mark-white.png"
      }
      width={98}
      height={96}
      alt="Picture of the github logo"
    />
  );
};

export default function GithubCard({
  githubUser,
}: {
  githubUser: string | undefined;
}) {
  if (!githubUser) {
    return (
      <CardHeader className="h-full place-items-center justify-evenly">
        <CardTitle>No Github Username</CardTitle>
        <GitHubIcon />
      </CardHeader>
    );
  }

  return (
    <CardHeader className="relative size-full place-items-center justify-center space-y-0">
      <GitHubIcon />
      <a
        className={cn(
          "cancelDrag absolute bottom-2 left-2",
          buttonVariants({ variant: "projectLink", size: "icon" }),
          githubUser === " " && "pointer-events-none opacity-10",
        )}
        href={`https://github.com/${githubUser}`}
      >
        <ArrowUpRightIcon className="size-6" />
      </a>
    </CardHeader>
  );
}
