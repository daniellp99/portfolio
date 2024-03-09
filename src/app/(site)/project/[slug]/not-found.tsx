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
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Project Not Found</CardTitle>
          <CardDescription>Could not find requested project</CardDescription>
        </CardHeader>
        <CardContent className="flex w-full items-center justify-center">
          <FrownIcon className="size-16" />
        </CardContent>
        <CardFooter>
          <Button variant="projectLink" size="icon" type="button" asChild>
            <Link href="/">
              <ChevronLeftIcon className="size-6" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
