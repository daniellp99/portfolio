/** Keys on `ResponsiveLayouts` / cookie payloads; aligned with RGL `Responsive` breakpoints. */
export const CANONICAL_LAYOUT_BREAKPOINT_KEYS = [
  "lg",
  "md",
  "sm",
  "xs",
  "xxs",
] as const;

export const LOGICAL_LAYOUT_BREAKPOINT_KEYS = [
  "lg",
  "sm",
  "xs",
] as const satisfies readonly LogicalLayoutBreakpoint[];

/** Slot tables and Y scaling use lg/sm/xs only; md mirrors lg, xxs mirrors xs in outputs. */
export type LogicalLayoutBreakpoint = "lg" | "sm" | "xs";

export const SCALE_Y: Record<LogicalLayoutBreakpoint, number> = {
  lg: 1.645,
  sm: 1.09,
  xs: 1,
};

const GRID_ROW_HEIGHT = 164;

export const MAIN_GRID_PROJECT_SLOT_COUNT = 3;

const GRID_RGL_BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
} as const;

const GRID_RGL_COLS = {
  lg: 4,
  md: 4,
  sm: 4,
  xs: 2,
  xxs: 2,
} as const;

const GRID_RGL_CONTAINER_PADDING = {
  xxs: [15.5, 15.5],
  xs: [15.5, 15.5],
  sm: [16, 16],
  md: [16, 16],
} as const satisfies Record<
  "xxs" | "xs" | "sm" | "md",
  readonly [number, number]
>;

const GRID_RGL_MARGIN = {
  xxs: [15.5, 15.5],
  xs: [15.5, 15.5],
  sm: [16, 16],
  md: [16, 16],
} as const satisfies Record<
  "xxs" | "xs" | "sm" | "md",
  readonly [number, number]
>;

/**
 * Main / image grid section caps — keep in sync with
 * `max-w-[375px] md:max-w-[800px] xl:max-w-[1200px]` on home & project sections.
 */
export const GRID_SECTION_MAX_WIDTH = {
  base: 375,
  md: 800,
  xl: 1200,
} as const;

/** Tailwind `md` / `xl` min-widths for the section caps above. */
const GRID_SECTION_VIEWPORT = {
  md: 768,
  xl: 1280,
} as const;

/** Section max width for a viewport, before `min()` with the viewport itself. */
export function gridSectionMaxWidth(viewportWidth: number): number {
  if (viewportWidth >= GRID_SECTION_VIEWPORT.xl) {
    return GRID_SECTION_MAX_WIDTH.xl;
  }
  if (viewportWidth >= GRID_SECTION_VIEWPORT.md) {
    return GRID_SECTION_MAX_WIDTH.md;
  }
  return GRID_SECTION_MAX_WIDTH.base;
}

/** Estimated container width for RGL `initialWidth` (matches capped section width). */
export function gridSectionInitialWidth(viewportWidth: number): number {
  return Math.min(viewportWidth, gridSectionMaxWidth(viewportWidth));
}

/** Props shared by `GridContainer` / RGL `Responsive` (single source vs slot math). */
export const GRID_RESPONSIVE_STATIC_PROPS = {
  breakpoints: GRID_RGL_BREAKPOINTS,
  cols: GRID_RGL_COLS,
  rowHeight: GRID_ROW_HEIGHT,
  containerPadding: GRID_RGL_CONTAINER_PADDING,
  margin: GRID_RGL_MARGIN,
};
