import { LogoCarousel } from "@/components/LogoCarousel";
import { SkillHoverProvider } from "@/components/SkillHoverContext";
import { SkillsHoverLabel } from "@/features/owner/components/skills-hover-label";
import { SkillsMarquee } from "@/features/owner/components/skills-marquee";
import { getOwnerData } from "@/features/owner/owner-queries";

export function SkillsCard() {
  const logos = getOwnerData().skills;

  return (
    <SkillHoverProvider>
      <SkillsMarquee>
        <SkillsHoverLabel />
        <LogoCarousel logos={logos} direction="ltr" />
        <LogoCarousel logos={logos} direction="rtl" />
      </SkillsMarquee>
    </SkillHoverProvider>
  );
}
