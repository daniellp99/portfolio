import { readOwnerData } from "@/lib/content/owner";
import { LogoCarousel } from "./LogoCarousel";

export default async function SkillsCard() {
  const owner = await readOwnerData();
  if (!owner) return null;

  return (
    <div className="grid size-full place-items-center py-3 xl:py-6">
      <LogoCarousel logos={owner.skills} opts={{ direction: "ltr" }} />
      <LogoCarousel logos={owner.skills} opts={{ direction: "rtl" }} />
    </div>
  );
}
