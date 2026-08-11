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
      <div className="text-xl leading-relaxed tracking-wide text-pretty antialiased">
        {beforeName}
        <h1 className="inline font-sans text-4xl font-extrabold">{name}</h1>
        {afterName}
      </div>
    </CardHeader>
  );
}
