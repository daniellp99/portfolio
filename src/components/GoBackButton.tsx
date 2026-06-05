"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";

import { Button } from "@/components/ui/button";

export default function GoBackButton() {
  return (
    <Button
      variant="projectLink"
      size="icon-lg"
      type="button"
      className="cancelDrag"
      aria-label="Go back to home"
      render={
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          onClick={() => posthog.capture("back_to_home_clicked")}
        />
      }
      nativeButton={false}
    >
      <XIcon className="size-6" />
    </Button>
  );
}
