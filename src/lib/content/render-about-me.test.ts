import { describe, expect, it } from "bun:test";

import { formatExperienceYears, renderAboutMe } from "./render-about-me";

describe("formatExperienceYears", () => {
  it("returns null for invalid dates", () => {
    expect(formatExperienceYears("not-a-date")).toBeNull();
  });

  it("returns a non-negative year count for valid dates", () => {
    const years = formatExperienceYears("2023-07-10T00:00:00Z");
    expect(years).toMatch(/^\d+\+ years$/);
  });
});

describe("renderAboutMe", () => {
  it("replaces name and experience placeholders", () => {
    const journeyStartAt = "2023-07-10T00:00:00Z";
    const experience = formatExperienceYears(journeyStartAt);

    expect(
      renderAboutMe({
        aboutMe: "I'm {name}, a developer with {experience} of experience.",
        name: "daniellp",
        journeyStartAt,
      }),
    ).toBe(
      `I'm daniellp, a developer with ${experience ?? "some years"} of experience.`,
    );
  });
});
