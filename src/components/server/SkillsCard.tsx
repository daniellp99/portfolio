import SkillsCardClient from "@/components/SkillsCardClient";
import { loadOwnerData } from "@/lib/server/content-load";

export default function SkillsCard() {
  const ownerData = loadOwnerData();
  return <SkillsCardClient logos={ownerData.skills} />;
}
