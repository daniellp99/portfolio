import { LogoCarousel } from "@/components/LogoCarousel";
import { SkillHoverProvider } from "@/components/SkillHoverContext";
import { SkillsHoverLabel } from "@/features/owner/components/skills-hover-label";
import { getOwnerData } from "@/features/owner/owner-queries";

export function SkillsCard() {
  const logos = getOwnerData().skills;

  return (
    <SkillHoverProvider>
      <div className="relative isolate flex size-full flex-col items-center justify-evenly">
        <SkillsHoverLabel />
        <LogoCarousel logos={logos} direction="ltr" />
        <LogoCarousel logos={logos} direction="rtl" />
      </div>
    </SkillHoverProvider>
  );
}
