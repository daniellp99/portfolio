import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";

import { getOwnerDataDTO } from "@/data/project-dto";

export function LogoFallback() {
  return <Skeleton className="size-20 rounded-full" />;
}

export default async function Logo() {
  const ownerData = await getOwnerDataDTO();
  return (
    <>
      {ownerData?.LightLogo && (
        <Image
          src={ownerData.LightLogo}
          alt="Logo"
          width={100}
          height={100}
          className="size-20 rounded-full dark:hidden"
        />
      )}
      {ownerData?.DarkLogo && (
        <Image
          src={ownerData.DarkLogo}
          alt="Logo"
          width={100}
          height={100}
          className="hidden size-20 rounded-full dark:block"
        />
      )}
    </>
  );
}
