import Image from "next/image";

export default function Logo({
  ownerLightLogo,
  ownerDarkLogo,
}: {
  ownerLightLogo: string | undefined;
  ownerDarkLogo: string | undefined;
}) {
  return (
    <>
      {ownerLightLogo && (
        <Image
          src={ownerLightLogo}
          alt="Logo"
          width={100}
          height={100}
          className="size-20 rounded-full dark:hidden"
        />
      )}
      {ownerDarkLogo && (
        <Image
          src={ownerDarkLogo}
          alt="Logo"
          width={100}
          height={100}
          className="hidden size-20 rounded-full dark:block"
        />
      )}
    </>
  );
}
