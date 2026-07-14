import {
  calcGridColWidth,
  getBreakpointFromWidth,
  getColsFromBreakpoint,
  getIndentationValue,
} from "react-grid-layout/core";

import { GRID_RESPONSIVE_STATIC_PROPS, SCALE_Y } from "./config";

/** RGL bp → SCALE_Y key (md mirrors lg, xxs mirrors xs — same aliasing as layout defaults). */
function logicalScaleYForBreakpoint(breakpoint: string): number {
  if (breakpoint === "lg" || breakpoint === "md") return SCALE_Y.lg;
  if (breakpoint === "sm") return SCALE_Y.sm;
  return SCALE_Y.xs;
}

/**
 * Doubled slot units: a former 1×1 square is w=1, h=2 before SCALE_Y.
 * After scale, unitRows = 2 * scaleY. Require colWidth === height(unitRows):
 *   colWidth = rowHeight * unitRows + (unitRows - 1) * marginY
 *   ⇒ rowHeight = (colWidth - (unitRows - 1) * marginY) / unitRows
 */
export function rowHeightForSquareUnit(
  colWidth: number,
  marginY: number,
  scaleY: number,
): number {
  const unitRows = 2 * scaleY;
  return (colWidth - (unitRows - 1) * marginY) / unitRows;
}

export function rowHeightForContainerWidth(containerWidth: number): number {
  const {
    breakpoints,
    cols: colsMap,
    margin,
    containerPadding,
  } = GRID_RESPONSIVE_STATIC_PROPS;
  const breakpoint = getBreakpointFromWidth(breakpoints, containerWidth);
  const cols = getColsFromBreakpoint(breakpoint, colsMap);
  const [marginX, marginY] = getIndentationValue(margin, breakpoint);
  const [paddingX] = getIndentationValue(containerPadding, breakpoint);
  const colWidth = calcGridColWidth({
    margin: [marginX, marginY],
    containerPadding: [paddingX, paddingX],
    containerWidth,
    cols,
    rowHeight: 0,
    maxRows: Infinity,
  });
  return rowHeightForSquareUnit(
    colWidth,
    marginY,
    logicalScaleYForBreakpoint(breakpoint),
  );
}
