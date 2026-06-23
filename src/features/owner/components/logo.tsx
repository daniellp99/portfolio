import Image from "next/image";

import { getOwnerData } from "@/features/owner/owner-queries";

import logo from "../../../../public/Avatar-lg.webp";

export function Logo() {
  const ownerData = getOwnerData();

  const altText = `${ownerData.name} Logo`;
  return (
    <Image
      src={logo}
      alt={altText}
      width={80}
      height={80}
      preload
      sizes="80px"
      fetchPriority="high"
      quality={90}
      className="size-20 rounded-full border border-foreground bg-foreground"
    />
  );
}
