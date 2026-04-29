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
      aria-label="Go back to home"
      render={<Link href="/" transitionTypes={["nav-back"]} />}
      nativeButton={false}
    >
      <XIcon className="size-6" />
    </Button>
  );
}
