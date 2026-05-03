import { describe, expect, it } from "bun:test";

import {
  contributionCountsByIsoDate,
  formatContributionDayTooltip,
  getMonthHeatmapGridDates,
  getMonthStartInZone,
  monthGridCellCount,
} from "./calendar-projection";

describe("monthGridCellCount", () => {
  it("counts cells for February 2024 grid", () => {
    expect(monthGridCellCount(2024, 2)).toBe(35);
  });
});

describe("getMonthHeatmapGridDates", () => {
  it("starts on Sunday of the week containing Feb 1", () => {
    const dates = getMonthHeatmapGridDates(2024, 2);
    expect(dates.length).toBe(35);
    expect(dates[0]?.getUTCDay()).toBe(0);
  });
});

describe("getMonthStartInZone", () => {
  it("returns start of month in zone", () => {
    const start = getMonthStartInZone(2024, 6);
    expect(start.getUTCMonth()).toBe(5);
  });
});

describe("contributionCountsByIsoDate", () => {
  it("flattens weeks into a map", () => {
    const map = contributionCountsByIsoDate({
      totalContributions: 2,
      weeks: [
        {
          contributionDays: [
            { date: "2024-01-01", contributionCount: 1 },
            { date: "2024-01-02", contributionCount: 1 },
          ],
        },
      ],
    });
    expect(map.get("2024-01-01")).toBe(1);
    expect(map.get("2024-01-02")).toBe(1);
  });
});

describe("formatContributionDayTooltip", () => {
  it("formats count and date", () => {
    const s = formatContributionDayTooltip("2024-06-15", 3);
    expect(s).toContain("3 contributions");
    expect(s).toContain("Jun");
  });
});
