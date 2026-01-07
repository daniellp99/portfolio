import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";

import { getOwnerData } from "@/server/owner";

export function LogoFallback() {
  return <Skeleton className="size-20 rounded-full" />;
}

export default async function Logo() {
  const ownerData = await getOwnerData();
  const ownerName = ownerData?.name || "Portfolio";
  const altText = `${ownerName} Logo`;

  if (!ownerData) {
    return null;
  }

  return (
    <Image
      src={ownerData.avatar}
      alt={altText}
      width={80}
      height={80}
      loading="eager"
      className="size-20 drop-shadow-[0px_0px_4px] drop-shadow-foreground transition-all"
    />
  );
}
