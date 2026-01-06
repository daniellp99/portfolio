import { CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getOwnerData } from "@/server/owner";

export default async function AboutMe() {
  const ownerData = await getOwnerData();
  if (!ownerData) {
    return <Skeleton className="size-full" />;
  }
  const { aboutMe, name } = ownerData;
  const [firstPart, secondPart] = aboutMe.split(name);
  return (
    <CardHeader className="size-full content-center">
      <p className="text-xl leading-relaxed tracking-wide text-pretty antialiased">
        {firstPart}
        <span className="font-sans text-4xl font-extrabold">{name}</span>
        {secondPart}
      </p>
    </CardHeader>
  );
}
