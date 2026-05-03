import SkillsCardClient from "@/components/SkillsCardClient";
import { getOwnerData } from "@/lib/server/owner";

export default async function SkillsCard() {
  const owner = await getOwnerData();
  if (!owner) return null;

  return <SkillsCardClient logos={owner.skills} />;
}
