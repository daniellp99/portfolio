import { describe, expect, it } from "bun:test";
import { calcGridColWidth, calcGridItemWHPx } from "react-grid-layout/core";

import { SCALE_Y } from "./config";
import {
  rowHeightForContainerWidth,
  rowHeightForSquareUnit,
} from "./square-size";

function colWidthAt(
  containerWidth: number,
  cols: number,
  margin: number,
): number {
  return calcGridColWidth({
    margin: [margin, margin],
    containerPadding: [margin, margin],
    containerWidth,
    cols,
    rowHeight: 0,
    maxRows: Infinity,
  });
}

describe("rowHeightForSquareUnit", () => {
  it("makes 1×2 and 2×4 (visual 1×1 / 2×2) square at xs 375", () => {
    const m = 15;
    const colWidth = colWidthAt(375, 2, m);
    const rh = rowHeightForSquareUnit(colWidth, m, SCALE_Y.xs);
    expect(colWidth).toBe(165);
    expect(rh).toBe(75);
    expect(calcGridItemWHPx(1, colWidth, m)).toBe(calcGridItemWHPx(2, rh, m));
    expect(calcGridItemWHPx(2, colWidth, m)).toBe(calcGridItemWHPx(4, rh, m));
  });

  it("makes visual squares at md 800 with SCALE_Y.sm", () => {
    const m = 16;
    const colWidth = colWidthAt(800, 4, m);
    const rh = rowHeightForSquareUnit(colWidth, m, SCALE_Y.sm);
    const unitH = 2 * SCALE_Y.sm;
    expect(calcGridItemWHPx(1, colWidth, m)).toBe(
      calcGridItemWHPx(unitH, rh, m),
    );
    expect(calcGridItemWHPx(2, colWidth, m)).toBe(
      calcGridItemWHPx(2 * unitH, rh, m),
    );
  });

  it("makes visual squares at xl 1200 with SCALE_Y.lg", () => {
    const m = 16;
    const colWidth = colWidthAt(1200, 4, m);
    const rh = rowHeightForSquareUnit(colWidth, m, SCALE_Y.lg);
    const unitH = 2 * SCALE_Y.lg;
    expect(calcGridItemWHPx(1, colWidth, m)).toBe(
      calcGridItemWHPx(unitH, rh, m),
    );
    expect(calcGridItemWHPx(2, colWidth, m)).toBe(
      calcGridItemWHPx(2 * unitH, rh, m),
    );
  });
});

describe("rowHeightForContainerWidth", () => {
  it("matches the derived rowHeight at section caps", () => {
    expect(rowHeightForContainerWidth(375)).toBe(75);
    expect(rowHeightForContainerWidth(800)).toBeCloseTo(
      rowHeightForSquareUnit(180, 16, SCALE_Y.sm),
      10,
    );
    expect(rowHeightForContainerWidth(1200)).toBeCloseTo(
      rowHeightForSquareUnit(280, 16, SCALE_Y.lg),
      10,
    );
  });
});
