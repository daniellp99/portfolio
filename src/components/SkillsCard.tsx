import { readOwnerData } from "@/lib/content/owner";
import SkillsCardClient from "@/components/SkillsCardClient";

export default async function SkillsCard() {
  const owner = await readOwnerData();
  if (!owner) return null;

  return <SkillsCardClient logos={owner.skills} />;
}
