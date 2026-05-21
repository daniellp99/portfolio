import { describe, expect, test } from "bun:test";

import {
  GRID_SECTION_MAX_WIDTH,
  gridSectionInitialWidth,
  gridSectionMaxWidth,
} from "./config";

describe("gridSectionMaxWidth", () => {
  test("matches home section caps by viewport", () => {
    expect(gridSectionMaxWidth(320)).toBe(GRID_SECTION_MAX_WIDTH.base);
    expect(gridSectionMaxWidth(767)).toBe(GRID_SECTION_MAX_WIDTH.base);
    expect(gridSectionMaxWidth(768)).toBe(GRID_SECTION_MAX_WIDTH.md);
    expect(gridSectionMaxWidth(1279)).toBe(GRID_SECTION_MAX_WIDTH.md);
    expect(gridSectionMaxWidth(1280)).toBe(GRID_SECTION_MAX_WIDTH.xl);
    expect(gridSectionMaxWidth(2000)).toBe(GRID_SECTION_MAX_WIDTH.xl);
  });
});

describe("gridSectionInitialWidth", () => {
  test("caps at section max and uses full width below cap", () => {
    expect(gridSectionInitialWidth(320)).toBe(320);
    expect(gridSectionInitialWidth(375)).toBe(375);
    expect(gridSectionInitialWidth(900)).toBe(800);
    expect(gridSectionInitialWidth(1500)).toBe(1200);
  });
});
