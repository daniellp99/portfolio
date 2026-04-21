import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import Link from "next/link";

export default function GoBackButton() {
  return (
    <Button
      variant="projectLink"
      size="icon-lg"
      type="button"
      className="cancelDrag"
      render={<Link href="/" />}
      nativeButton={false}
    >
      <XIcon className="size-6" />
    </Button>
  );
}
