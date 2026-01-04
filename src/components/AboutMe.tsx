import { CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutMe({
  description,
  name,
}: {
  description: string | undefined;
  name: string | undefined;
}) {
  if (!description || !name) {
    return <Skeleton className="size-full" />;
  }

  const [firstPart, secondPart] = description.split(name);
  return (
    <CardHeader className="size-full justify-center">
      <p className="text-xl leading-relaxed tracking-wide text-pretty antialiased">
        {firstPart}
        <span className="font-sans text-4xl font-extrabold">{name}</span>
        {secondPart}
      </p>
    </CardHeader>
  );
}
