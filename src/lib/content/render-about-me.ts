import { cacheLife } from "next/cache";

export function formatExperienceYears(
  journeyStartAtIso: string,
  referenceDate: Date,
): string | null {
  const start = new Date(journeyStartAtIso);
  if (Number.isNaN(start.getTime())) return null;

  // Full-year difference (UTC) to avoid timezone off-by-one.
  let years = referenceDate.getUTCFullYear() - start.getUTCFullYear();
  const m = referenceDate.getUTCMonth() - start.getUTCMonth();
  if (m < 0 || (m === 0 && referenceDate.getUTCDate() < start.getUTCDate())) {
    years -= 1;
  }
  if (years < 0) years = 0;
  return `${years}+ years`;
}

export function renderAboutMe(
  input: {
    aboutMe: string;
    name: string;
    journeyStartAt: string;
  },
  referenceDate: Date,
): string {
  const experience = formatExperienceYears(input.journeyStartAt, referenceDate);
  return input.aboutMe
    .replace("{name}", input.name)
    .replace("{experience}", experience ?? "some years");
}

/** Cached so metadata and prerendered shells can resolve `{experience}` safely. */
export async function renderAboutMeCached(input: {
  aboutMe: string;
  name: string;
  journeyStartAt: string;
}): Promise<string> {
  "use cache";
  cacheLife("days");

  return renderAboutMe(input, new Date());
}
