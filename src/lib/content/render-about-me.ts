export function formatExperienceYears(
  journeyStartAtIso: string,
): string | null {
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

export function renderAboutMe(input: {
  aboutMe: string;
  name: string;
  journeyStartAt: string;
}): string {
  const experience = formatExperienceYears(input.journeyStartAt);
  return input.aboutMe
    .replace("{name}", input.name)
    .replace("{experience}", experience ?? "some years");
}
