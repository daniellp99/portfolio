import { Spinner } from "@/components/ui/spinner";

export default function LoadingPage() {
  return (
    <div className="grid h-screen w-full place-content-center place-items-center">
      <Spinner className="size-10" />
    </div>
  );
}
