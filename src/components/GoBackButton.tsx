"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <Button
      variant="projectLink"
      size="icon"
      type="button"
      onClick={() => router.back()}
      className="cancelDrag"
    >
      <XIcon className="size-6" />
    </Button>
  );
}
