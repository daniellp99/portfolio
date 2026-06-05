"use client";

import { ArrowUpRightIcon } from "lucide-react";
import posthog from "posthog-js";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContributionsOpenProfileLink({
  login,
  className,
}: {
  login: string;
  className?: string;
}) {
  return (
    <a
      className={cn(
        "cancelDrag",
        buttonVariants({ variant: "projectLink", size: "icon-lg" }),
        className,
      )}
      href={`https://github.com/${login}`}
      onClick={() =>
        posthog.capture("github_profile_link_clicked", { github_login: login })
      }
    >
      <ArrowUpRightIcon data-icon="inline-start" className="size-5" />
      <span className="sr-only">Open GitHub profile</span>
    </a>
  );
}
