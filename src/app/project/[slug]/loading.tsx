import { Spinner } from "@/components/ui/spinner";
import { ViewTransition } from "react";

export default function LoadingPage() {
  return (
    <ViewTransition exit="slide-down">
      <div className="grid h-screen w-full place-content-center place-items-center">
        <Spinner className="size-10" />
      </div>
    </ViewTransition>
  );
}
