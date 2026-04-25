import { readOwnerData } from "@/lib/content/owner";
import { LogoCarousel } from "./LogoCarousel";

export default async function SkillsCard() {
  const owner = await readOwnerData();
  if (!owner) return null;

  return (
    <div className="flex size-full flex-col items-center justify-evenly">
      <LogoCarousel logos={owner.skills} opts={{ direction: "ltr" }} />
      <LogoCarousel logos={owner.skills} opts={{ direction: "rtl" }} />
    </div>
  );
}
