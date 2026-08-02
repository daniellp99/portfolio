"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { capture } from "@/lib/analytics";

export default function GoBackButton() {
  return (
    <Button
      variant="projectLink"
      size="icon-lg"
      type="button"
      className="cancelDrag"
      render={
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          aria-label="Go back to home"
          onClick={() => capture("back_to_home_clicked")}
        />
      }
      nativeButton={false}
    >
      <XIcon className="size-6" aria-hidden />
      <span className="sr-only">Go back to home</span>
    </Button>
  );
}
