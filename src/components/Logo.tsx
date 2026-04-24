import Image from "next/image";

import { LoaderSkeleton } from "@/components/animations/skeleton";

import { getOwnerData } from "@/lib/server/owner";
import { getOwnerAvatarPath } from "@/lib/site/metadata";

export function LogoFallback() {
  return <LoaderSkeleton className="size-20 rounded-full" />;
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
      src={getOwnerAvatarPath(ownerData.avatar)}
      alt={altText}
      width={80}
      height={80}
      preload
      sizes="80px"
      quality={90}
      className="size-20 drop-shadow-[0px_0px_4px] drop-shadow-foreground"
    />
  );
}
