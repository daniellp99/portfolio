import { ChevronLeftIcon, FrownIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="grid h-screen w-full place-content-center place-items-center">
      <Card className="min-w-xs">
        <CardHeader>
          <CardTitle className="text-3xl">Project Not Found</CardTitle>
          <CardDescription>Could not find requested project</CardDescription>
        </CardHeader>
        <CardContent className="flex w-full items-center justify-center">
          <FrownIcon className="size-16" />
        </CardContent>
        <CardFooter>
          <Button
            variant="projectLink"
            size="icon-lg"
            render={<Link href="/" />}
            nativeButton={false}
          >
            <ChevronLeftIcon className="size-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
