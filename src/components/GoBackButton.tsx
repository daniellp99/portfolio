"use client";

import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <Button
      variant="projectLink"
      size="icon-lg"
      type="button"
      onClick={() => router.back()}
      className="cancelDrag"
    >
      <XIcon className="size-6" />
    </Button>
  );
}
