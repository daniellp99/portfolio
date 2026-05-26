import { ArrowUpRightIcon } from "lucide-react";

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
    >
      <ArrowUpRightIcon data-icon="inline-start" className="size-5" />
      <span className="sr-only">Open GitHub profile</span>
    </a>
  );
}
