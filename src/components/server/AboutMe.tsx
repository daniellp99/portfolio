import { CardHeader } from "@/components/ui/card";

import { loadOwnerData } from "@/lib/server/content-load";

function formatExperienceYears(journeyStartAtIso: string) {
  const start = new Date(journeyStartAtIso);
  const now = new Date();
  if (Number.isNaN(start.getTime())) return null;

  // Full-year difference (UTC) to avoid timezone off-by-one.
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  const m = now.getUTCMonth() - start.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < start.getUTCDate())) {
    years -= 1;
  }
  if (years < 0) years = 0;
  return `${years}+ years`;
}

export default function AboutMe() {
  const { aboutMe, name, journeyStartAt } = loadOwnerData();
  const experience = formatExperienceYears(journeyStartAt);
  const renderedAboutMe = aboutMe
    .replace("{name}", name)
    .replace("{experience}", experience ?? "some years");

  const nameParts = renderedAboutMe.split(name);
  const beforeName = nameParts[0] ?? renderedAboutMe;
  const afterName = nameParts.length >= 2 ? nameParts.slice(1).join(name) : "";
  return (
    <CardHeader className="size-full content-center">
      <p className="text-xl leading-relaxed tracking-wide text-pretty antialiased">
        {beforeName}
        <span className="font-sans text-4xl font-extrabold">{name}</span>
        {afterName}
      </p>
    </CardHeader>
  );
}
