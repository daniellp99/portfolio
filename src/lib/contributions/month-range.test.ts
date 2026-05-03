import { describe, expect, it } from "bun:test";

import { CONTRIBUTIONS_TZ } from "./constants";
import { toIsoDateRangeForMonth } from "./month-range";

describe("toIsoDateRangeForMonth", () => {
  it("defaults to CONTRIBUTIONS_TZ", () => {
    const { from, to } = toIsoDateRangeForMonth(2024, 3);
    expect(from).toBe(toIsoDateRangeForMonth(2024, 3, CONTRIBUTIONS_TZ).from);
    expect(to).toBe(toIsoDateRangeForMonth(2024, 3, CONTRIBUTIONS_TZ).to);
  });

  it("covers March 2024 in UTC", () => {
    const { from, to } = toIsoDateRangeForMonth(2024, 3, "UTC");
    expect(from).toBe("2024-03-01T00:00:00.000Z");
    expect(to).toBe("2024-03-31T23:59:59.999Z");
  });
});
