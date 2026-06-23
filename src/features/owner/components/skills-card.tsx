import SkillsCardClient from "@/features/owner/components/skills-card-client";
import { getOwnerData } from "@/features/owner/owner-queries";

export function SkillsCard() {
  const ownerData = getOwnerData();
  return <SkillsCardClient logos={ownerData.skills} />;
}
