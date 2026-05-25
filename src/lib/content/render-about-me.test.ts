import { describe, expect, it } from "bun:test";

import { formatExperienceYears, renderAboutMe } from "./render-about-me";

const referenceDate = new Date("2026-05-25T12:00:00Z");

describe("formatExperienceYears", () => {
  it("returns null for invalid dates", () => {
    expect(formatExperienceYears("not-a-date", referenceDate)).toBeNull();
  });

  it("returns full UTC year difference", () => {
    expect(formatExperienceYears("2023-07-10T00:00:00Z", referenceDate)).toBe(
      "2+ years",
    );
  });
});

describe("renderAboutMe", () => {
  it("replaces name and experience placeholders", () => {
    expect(
      renderAboutMe(
        {
          aboutMe: "I'm {name}, a developer with {experience} of experience.",
          name: "daniellp",
          journeyStartAt: "2023-07-10T00:00:00Z",
        },
        referenceDate,
      ),
    ).toBe("I'm daniellp, a developer with 2+ years of experience.");
  });
});
