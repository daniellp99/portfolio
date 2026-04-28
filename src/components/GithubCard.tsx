import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

import githubMarkWhite from "@/assets/brand/github-mark-white.webp";
import githubMark from "@/assets/brand/github-mark.webp";
import { buttonVariants } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { getOwnerData } from "@/lib/server/owner";

const GitHubIcon = () => {
  return (
    <>
      <Image
        src={githubMark}
        alt="GitHub logo"
        className="block size-[98px] dark:hidden"
        placeholder="blur"
        quality={90}
      />
      <Image
        src={githubMarkWhite}
        alt="GitHub logo"
        className="hidden size-[98px] dark:block"
        placeholder="blur"
        quality={90}
      />
    </>
  );
};

export default async function GithubCard() {
  const ownerData = await getOwnerData();
  if (!ownerData) {
    return (
      <CardHeader className="h-full place-content-center place-items-center justify-evenly">
        <CardTitle>No Github Username</CardTitle>
        <GitHubIcon />
      </CardHeader>
    );
  }

  return (
    <CardHeader className="relative size-full place-content-center place-items-center space-y-0">
      <GitHubIcon />
      <a
        className={cn(
          "cancelDrag absolute bottom-2 left-2",
          buttonVariants({ variant: "projectLink", size: "icon-lg" }),
          ownerData.githubUser === " " && "pointer-events-none opacity-10",
        )}
        aria-label="Open GitHub profile"
        href={`https://github.com/${ownerData.githubUser}`}
      >
        <ArrowUpRightIcon className="size-6" />
      </a>
    </CardHeader>
  );
}
