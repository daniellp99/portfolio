import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { getOwnerData } from "@/server/owner";

const GitHubIcon = () => {
  return (
    <>
      <Image
        width={98}
        height={96}
        alt="Picture of the github logo"
        src="/github-mark.png"
        className="block dark:hidden"
      />
      <Image
        width={98}
        height={96}
        alt="Picture of the github logo"
        src={"/github-mark-white.png"}
        className="hidden dark:block"
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
        href={`https://github.com/${ownerData.githubUser}`}
      >
        <ArrowUpRightIcon className="size-6" />
      </a>
    </CardHeader>
  );
}
