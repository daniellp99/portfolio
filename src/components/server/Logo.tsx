import Image from "next/image";

import { loadOwnerData } from "@/lib/server/content-load";

import logo from "../../../public/Avatar-lg.webp";

export default function Logo() {
  const ownerData = loadOwnerData();

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
