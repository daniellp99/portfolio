import { CardHeader } from "@/components/ui/card";

import { getOwnerData } from "@/features/owner/owner-queries";
import { renderAboutMeCached } from "@/lib/content/render-about-me";

export async function AboutMe() {
  const { aboutMe, name, journeyStartAt } = getOwnerData();
  const renderedAboutMe = await renderAboutMeCached({
    aboutMe,
    name,
    journeyStartAt,
  });

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
