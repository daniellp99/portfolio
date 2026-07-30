import type { Layout } from "react-grid-layout";

import type { Images } from "@/lib/content/display";
import { TabsType } from "@/lib/site/tabs";
import type { LogicalLayoutBreakpoint } from "./config";
import { GRID_RESPONSIVE_STATIC_PROPS, SCALE_Y } from "./config";
import { applyResizePolicyToLayoutItem } from "./resize-policy";

function withRglBreakpointAliases(layouts: {
  lg: Layout;
  sm: Layout;
  xs: Layout;
}): {
  lg: Layout;
  md: Layout;
  sm: Layout;
  xs: Layout;
  xxs: Layout;
} {
  const { lg, sm, xs } = layouts;
  return { lg, md: lg, sm, xs, xxs: xs };
}

type Variant = "default" | "about" | "projects";
type LayoutItem = Layout[number];
type Slot = { x: number; y: number; w: number; h: number };
type BaseItemId = "me" | "toggle-theme" | "skills" | "maps" | "contributions";
type BaseSlotUnits = { x: number; y: number; w: number; h: number };

const TAB_TO_VARIANT = {
  All: "default",
  About: "about",
  Projects: "projects",
} as const satisfies Record<TabsType, Variant>;
const PROJECT_SLOTS: Record<
  Variant,
  Record<LogicalLayoutBreakpoint, Slot[]>
> = {
  default: {
    lg: [
      { x: 1, y: 0, w: 1, h: 2 },
      { x: 0, y: 2, w: 1, h: 2 },
      { x: 2, y: 2, w: 1, h: 2 },
    ],
    sm: [
      { x: 3, y: 0, w: 1, h: 2 },
      { x: 0, y: 4, w: 1, h: 2 },
      { x: 2, y: 4, w: 1, h: 2 },
    ],
    xs: [
      { x: 1, y: 6, w: 1, h: 2 },
      { x: 0, y: 12, w: 1, h: 2 },
      { x: 0, y: 8, w: 1, h: 2 },
    ],
  },
  about: {
    lg: [
      { x: 3, y: 2, w: 1, h: 2 },
      { x: 2, y: 6, w: 1, h: 2 },
      { x: 2, y: 2, w: 1, h: 2 },
    ],
    sm: [
      { x: 3, y: 2, w: 1, h: 2 },
      { x: 0, y: 6, w: 1, h: 2 },
      { x: 2, y: 2, w: 1, h: 2 },
    ],
    xs: [
      { x: 1, y: 6, w: 1, h: 2 },
      { x: 1, y: 10, w: 1, h: 2 },
      { x: 0, y: 8, w: 1, h: 2 },
    ],
  },
  projects: {
    lg: [
      { x: 1, y: 0, w: 1, h: 2 },
      { x: 0, y: 0, w: 1, h: 2 },
      { x: 3, y: 0, w: 1, h: 2 },
    ],
    sm: [
      { x: 1, y: 0, w: 1, h: 2 },
      { x: 0, y: 0, w: 1, h: 2 },
      { x: 3, y: 0, w: 1, h: 2 },
    ],
    xs: [
      { x: 1, y: 0, w: 1, h: 2 },
      { x: 0, y: 2, w: 1, h: 2 },
      { x: 0, y: 0, w: 1, h: 2 },
    ],
  },
};

export const BASE_ITEM_ORDER = [
  "me",
  "toggle-theme",
  "skills",
  "maps",
  "contributions",
] as const satisfies readonly BaseItemId[];

const BASE_SLOTS: Record<
  Variant,
  Record<LogicalLayoutBreakpoint, Record<BaseItemId, BaseSlotUnits>>
> = {
  default: {
    lg: {
      me: { x: 0, y: 0, w: 2, h: 2 },
      "toggle-theme": { x: 3, y: 4, w: 1, h: 1 },
      skills: { x: 2, y: 4, w: 1, h: 2 },
      maps: { x: 2, y: 0, w: 1, h: 2 },
      contributions: { x: 3, y: 2, w: 1, h: 3 },
    },
    sm: {
      me: { x: 0, y: 0, w: 2, h: 4 },
      "toggle-theme": { x: 2, y: 2, w: 1, h: 1 },
      skills: { x: 3, y: 4, w: 1, h: 2 },
      maps: { x: 3, y: 0, w: 1, h: 2 },
      contributions: { x: 2, y: 0, w: 1, h: 3 },
    },
    xs: {
      me: { x: 0, y: 0, w: 2, h: 4 },
      "toggle-theme": { x: 1, y: 10, w: 1, h: 1 },
      skills: { x: 1, y: 10, w: 1, h: 2 },
      maps: { x: 0, y: 4, w: 2, h: 2 },
      contributions: { x: 0, y: 6, w: 1, h: 3 },
    },
  },
  about: {
    lg: {
      me: { x: 0, y: 0, w: 2, h: 2 },
      "toggle-theme": { x: 1, y: 2, w: 1, h: 1 },
      skills: { x: 3, y: 0, w: 1, h: 2 },
      maps: { x: 2, y: 0, w: 1, h: 2 },
      contributions: { x: 0, y: 2, w: 1, h: 3 },
    },
    sm: {
      me: { x: 0, y: 0, w: 2, h: 4 },
      "toggle-theme": { x: 1, y: 10, w: 1, h: 1 },
      skills: { x: 3, y: 0, w: 1, h: 2 },
      maps: { x: 2, y: 0, w: 1, h: 2 },
      contributions: { x: 2, y: 4, w: 1, h: 3 },
    },
    xs: {
      me: { x: 0, y: 2, w: 2, h: 4 },
      "toggle-theme": { x: 1, y: 10, w: 1, h: 1 },
      skills: { x: 0, y: 6, w: 1, h: 2 },
      maps: { x: 0, y: 0, w: 2, h: 2 },
      contributions: { x: 0, y: 16, w: 1, h: 3 },
    },
  },
  projects: {
    lg: {
      me: { x: 0, y: 2, w: 2, h: 2 },
      "toggle-theme": { x: 3, y: 4, w: 1, h: 1 },
      skills: { x: 2, y: 4, w: 1, h: 2 },
      maps: { x: 2, y: 4, w: 1, h: 2 },
      contributions: { x: 3, y: 0, w: 1, h: 3 },
    },
    sm: {
      me: { x: 0, y: 2, w: 2, h: 4 },
      "toggle-theme": { x: 3, y: 4, w: 1, h: 1 },
      skills: { x: 2, y: 2, w: 1, h: 2 },
      maps: { x: 2, y: 4, w: 1, h: 2 },
      contributions: { x: 3, y: 0, w: 1, h: 3 },
    },
    xs: {
      me: { x: 0, y: 10, w: 2, h: 4 },
      "toggle-theme": { x: 0, y: 6, w: 1, h: 1 },
      skills: { x: 0, y: 4, w: 1, h: 2 },
      maps: { x: 0, y: 8, w: 2, h: 2 },
      contributions: { x: 1, y: 4, w: 1, h: 3 },
    },
  },
};

function scale(size: LogicalLayoutBreakpoint, units: number) {
  return SCALE_Y[size] * units;
}

function layoutItemFromSlot(
  id: string,
  slot: Slot,
  size: LogicalLayoutBreakpoint,
  mode: "main" | "image",
): LayoutItem {
  const cols = GRID_RESPONSIVE_STATIC_PROPS.cols[size];
  return applyResizePolicyToLayoutItem(
    {
      i: id,
      x: slot.x,
      y: scale(size, slot.y),
      w: slot.w,
      h: scale(size, slot.h),
    },
    mode,
    cols,
  );
}

function logicalLayoutsFromSizes(
  build: (size: LogicalLayoutBreakpoint) => Layout,
): ReturnType<typeof withRglBreakpointAliases> {
  return withRglBreakpointAliases({
    lg: build("lg"),
    sm: build("sm"),
    xs: build("xs"),
  });
}

function layoutForVariant(
  size: LogicalLayoutBreakpoint,
  variant: Variant,
  projectKeys: string[],
): Layout {
  const baseSlots = BASE_SLOTS[variant][size];
  const projectSlots = PROJECT_SLOTS[variant][size];
  const projectCount = Math.min(projectKeys.length, projectSlots.length);
  const out: LayoutItem[] = new Array(BASE_ITEM_ORDER.length + projectCount);

  for (let i = 0; i < BASE_ITEM_ORDER.length; i++) {
    const id = BASE_ITEM_ORDER[i]!;
    out[i] = layoutItemFromSlot(id, baseSlots[id], size, "main");
  }

  for (let index = 0; index < projectCount; index++) {
    out[BASE_ITEM_ORDER.length + index] = layoutItemFromSlot(
      projectKeys[index]!,
      projectSlots[index]!,
      size,
      "main",
    );
  }

  return out;
}

function imageLayout(size: LogicalLayoutBreakpoint, images: Images): Layout {
  const colsNumber = size === "xs" ? 2 : 4;
  const len = images.length;
  const out: LayoutItem[] = new Array(len);
  let totalWSoFar = 0;

  for (let i = 0; i < len; i++) {
    const image = images[i]!;
    let x = 0;
    let y = 0;
    const totalW = totalWSoFar;

    if (totalW < colsNumber) {
      x = totalW;
    } else if (totalW === colsNumber) {
      y = 2;
    } else {
      x = Math.ceil(totalW % colsNumber);
      y = Math.floor(totalW / colsNumber) * 2;
    }

    totalWSoFar += image.width;
    const cols = GRID_RESPONSIVE_STATIC_PROPS.cols[size];
    out[i] = applyResizePolicyToLayoutItem(
      {
        i: image.src,
        x,
        y: scale(size, y),
        w: image.width,
        h: scale(size, image.height * 2),
      },
      "image",
      cols,
    );
  }

  return out;
}

export function generateLayouts(tab: TabsType, projectKeys: string[]) {
  const variant = TAB_TO_VARIANT[tab];
  return logicalLayoutsFromSizes((size) =>
    layoutForVariant(size, variant, projectKeys),
  );
}

export function generateImageLayouts(images: Images) {
  return logicalLayoutsFromSizes((size) => imageLayout(size, images));
}
