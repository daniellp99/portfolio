import type { Layout } from "react-grid-layout";

import type { Images } from "@/lib/content/display";
import { TabsType } from "@/lib/site/tabs";
import type { LogicalLayoutBreakpoint } from "./config";
import { SCALE_Y } from "./config";
import { withRglBreakpointAliases } from "./layout-copy";

type Variant = "default" | "about" | "projects";
type LayoutItem = Layout[number];
type Slot = { x: number; y: number; w: number; h: number };
type BaseItemId = "me" | "toggle-theme" | "skills" | "maps" | "contributions";
type BaseSlotUnits = { x: number; y: number; w: number; h: number };

const IS_RESIZABLE = false;
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
      { x: 1, y: 0, w: 1, h: 1 },
      { x: 0, y: 1, w: 1, h: 1 },
      { x: 2, y: 1, w: 1, h: 1 },
    ],
    sm: [
      { x: 3, y: 0, w: 1, h: 1 },
      { x: 0, y: 2, w: 1, h: 1 },
      { x: 2, y: 2, w: 1, h: 1 },
    ],
    xs: [
      { x: 1, y: 3, w: 1, h: 1 },
      { x: 0, y: 6, w: 1, h: 1 },
      { x: 0, y: 4, w: 1, h: 1 },
    ],
  },
  about: {
    lg: [
      { x: 3, y: 1, w: 1, h: 1 },
      { x: 2, y: 3, w: 1, h: 1 },
      { x: 2, y: 1, w: 1, h: 1 },
    ],
    sm: [
      { x: 3, y: 1, w: 1, h: 1 },
      { x: 0, y: 3, w: 1, h: 1 },
      { x: 2, y: 1, w: 1, h: 1 },
    ],
    xs: [
      { x: 1, y: 3, w: 1, h: 1 },
      { x: 1, y: 5, w: 1, h: 1 },
      { x: 0, y: 4, w: 1, h: 1 },
    ],
  },
  projects: {
    lg: [
      { x: 1, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 1, h: 1 },
      { x: 3, y: 0, w: 1, h: 1 },
    ],
    sm: [
      { x: 1, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 1, h: 1 },
      { x: 3, y: 0, w: 1, h: 1 },
    ],
    xs: [
      { x: 1, y: 0, w: 1, h: 1 },
      { x: 0, y: 1, w: 1, h: 1 },
      { x: 0, y: 0, w: 1, h: 1 },
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
      me: { x: 0, y: 0, w: 2, h: 1 },
      "toggle-theme": { x: 3, y: 2, w: 1, h: 0.5 },
      skills: { x: 2, y: 2, w: 1, h: 1 },
      maps: { x: 2, y: 0, w: 1, h: 1 },
      contributions: { x: 3, y: 1, w: 1, h: 1.5 },
    },
    sm: {
      me: { x: 0, y: 0, w: 2, h: 2 },
      "toggle-theme": { x: 2, y: 1, w: 1, h: 0.5 },
      skills: { x: 3, y: 2, w: 1, h: 1 },
      maps: { x: 3, y: 0, w: 1, h: 1 },
      contributions: { x: 2, y: 0, w: 1, h: 1.5 },
    },
    xs: {
      me: { x: 0, y: 0, w: 2, h: 2 },
      "toggle-theme": { x: 1, y: 5, w: 1, h: 0.5 },
      skills: { x: 1, y: 5, w: 1, h: 1 },
      maps: { x: 0, y: 2, w: 2, h: 1 },
      contributions: { x: 0, y: 3, w: 1, h: 1.5 },
    },
  },
  about: {
    lg: {
      me: { x: 0, y: 0, w: 2, h: 1 },
      "toggle-theme": { x: 1, y: 1, w: 1, h: 0.5 },
      skills: { x: 3, y: 0, w: 1, h: 1 },
      maps: { x: 2, y: 0, w: 1, h: 1 },
      contributions: { x: 0, y: 1, w: 1, h: 1.5 },
    },
    sm: {
      me: { x: 0, y: 0, w: 2, h: 2 },
      "toggle-theme": { x: 1, y: 5, w: 1, h: 0.5 },
      skills: { x: 3, y: 0, w: 1, h: 1 },
      maps: { x: 2, y: 0, w: 1, h: 1 },
      contributions: { x: 2, y: 2, w: 1, h: 1.5 },
    },
    xs: {
      me: { x: 0, y: 1, w: 2, h: 2 },
      "toggle-theme": { x: 1, y: 5, w: 1, h: 0.5 },
      skills: { x: 0, y: 3, w: 1, h: 1 },
      maps: { x: 0, y: 0, w: 2, h: 1 },
      contributions: { x: 0, y: 8, w: 1, h: 1.5 },
    },
  },
  projects: {
    lg: {
      me: { x: 0, y: 1, w: 2, h: 1 },
      "toggle-theme": { x: 3, y: 2, w: 1, h: 0.5 },
      skills: { x: 2, y: 2, w: 1, h: 1 },
      maps: { x: 2, y: 2, w: 1, h: 1 },
      contributions: { x: 3, y: 0, w: 1, h: 1.5 },
    },
    sm: {
      me: { x: 0, y: 1, w: 2, h: 2 },
      "toggle-theme": { x: 3, y: 2, w: 1, h: 0.5 },
      skills: { x: 2, y: 1, w: 1, h: 1 },
      maps: { x: 2, y: 2, w: 1, h: 1 },
      contributions: { x: 3, y: 0, w: 1, h: 1.5 },
    },
    xs: {
      me: { x: 0, y: 5, w: 2, h: 2 },
      "toggle-theme": { x: 0, y: 3, w: 1, h: 0.5 },
      skills: { x: 0, y: 2, w: 1, h: 1 },
      maps: { x: 0, y: 4, w: 2, h: 1 },
      contributions: { x: 1, y: 2, w: 1, h: 1.5 },
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
): LayoutItem {
  return {
    i: id,
    x: slot.x,
    y: scale(size, slot.y),
    w: slot.w,
    h: scale(size, slot.h),
    isResizable: IS_RESIZABLE,
  };
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
    out[i] = layoutItemFromSlot(id, baseSlots[id], size);
  }

  for (let index = 0; index < projectCount; index++) {
    out[BASE_ITEM_ORDER.length + index] = layoutItemFromSlot(
      projectKeys[index]!,
      projectSlots[index]!,
      size,
    );
  }

  return out as Layout;
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
      y = 1;
    } else {
      x = Math.ceil(totalW % colsNumber);
      y = Math.floor(totalW / colsNumber);
    }

    totalWSoFar += image.width;
    out[i] = {
      i: image.src,
      x,
      y: scale(size, y),
      w: image.width,
      h: scale(size, image.height),
      isResizable: IS_RESIZABLE,
    };
  }

  return out as Layout;
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
