import { Layout } from "react-grid-layout";

import { Images } from "@/lib/server/project-dto";
import { TabsType } from "@/lib/site/tabs";

type Breakpoint = "lg" | "sm" | "xs";

type Variant = "default" | "about" | "projects";
type LayoutItem = Layout[number];
type Slot = { x: number; y: number; w: number; h: number };

const SCALE_Y: Record<Breakpoint, number> = { lg: 1.645, sm: 1.09, xs: 1 };
const IS_RESIZABLE = false;
const TAB_TO_VARIANT = {
  All: "default",
  About: "about",
  Projects: "projects",
} as const satisfies Record<TabsType, Variant>;
const PROJECT_SLOTS: Record<Variant, Record<Breakpoint, Slot[]>> = {
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
      { x: 0, y: 3, w: 1, h: 1 },
      { x: 2, y: 1, w: 1, h: 1 },
    ],
    sm: [
      { x: 3, y: 1, w: 1, h: 1 },
      { x: 0, y: 3, w: 1, h: 1 },
      { x: 2, y: 1, w: 1, h: 1 },
    ],
    xs: [
      { x: 1, y: 3, w: 1, h: 1 },
      { x: 0, y: 10, w: 1, h: 1 },
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
      { x: 0, y: 2, w: 1, h: 1 },
      { x: 0, y: 0, w: 1, h: 1 },
    ],
  },
};

function withMdFromLg(x: { lg: Layout; sm: Layout; xs: Layout }) {
  return { ...x, md: x.lg };
}

function scale(size: Breakpoint, units: number) {
  return SCALE_Y[size] * units;
}

function baseItems(variant: Variant, size: Breakpoint): Layout {
  switch (variant) {
    case "default":
      return [
        {
          i: "me",
          x: 0,
          y: 0,
          w: 2,
          h: scale(size, size === "lg" ? 1 : 2),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "toggle-theme",
          x: size === "xs" ? 1 : 3,
          y: scale(size, size === "xs" ? 5 : 2),
          w: 1,
          h: scale(size, 0.5),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "skills",
          x: size === "xs" ? 0 : 2,
          y: scale(size, size === "xs" ? 5 : 2),
          w: 1,
          h: scale(size, 1),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "maps",
          x: size === "xs" ? 0 : 2,
          y: scale(size, size === "xs" ? 2 : 0),
          w: size === "xs" ? 2 : 1,
          h: scale(size, 1),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "contributions",
          x: size === "xs" ? 0 : size === "sm" ? 2 : 3,
          y: scale(size, size === "xs" ? 3 : 1),
          w: 1,
          h: scale(size, 1.5),
          isResizable: IS_RESIZABLE,
        },
      ];
    case "about":
      return [
        {
          i: "me",
          x: 0,
          y: scale(size, size === "xs" ? 1 : 0),
          w: 2,
          h: scale(size, size === "lg" ? 1 : 2),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "toggle-theme",
          x: 1,
          y: scale(size, size === "lg" ? 1 : 5),
          w: 1,
          h: scale(size, 0.5),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "skills",
          x: size === "xs" ? 0 : 3,
          y: scale(size, size === "xs" ? 3 : 0),
          w: 1,
          h: scale(size, 1),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "maps",
          x: size === "xs" ? 0 : 2,
          y: 0,
          w: size === "xs" ? 2 : 1,
          h: scale(size, 1),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "contributions",
          x: 0,
          y: scale(size, size === "xs" ? 8 : size === "lg" ? 1 : 6),
          w: 1,
          h: scale(size, 1.5),
          isResizable: IS_RESIZABLE,
        },
      ];
    case "projects":
      return [
        {
          i: "me",
          x: 0,
          y: scale(size, size === "xs" ? 4 : 1),
          w: 2,
          h: scale(size, size === "lg" ? 1 : 2),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "toggle-theme",
          x: size === "sm" ? 2 : 3,
          y: scale(size, size === "xs" ? 6 : size === "sm" ? 5 : 2),
          w: 1,
          h: scale(size, 0.5),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "skills",
          x: size === "xs" ? 0 : 2,
          y: scale(size, size === "xs" ? 6 : size === "sm" ? 5 : 2),
          w: 1,
          h: scale(size, 1),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "maps",
          x: size === "xs" ? 0 : 2,
          y: scale(size, size === "xs" ? 3 : 2),
          w: size === "xs" ? 2 : 1,
          h: scale(size, 1),
          isResizable: IS_RESIZABLE,
        },
        {
          i: "contributions",
          x: size === "xs" ? 0 : 3,
          y: scale(size, size === "xs" ? 2 : 0),
          w: 1,
          h: scale(size, 1.5),
          isResizable: IS_RESIZABLE,
        },
      ];
  }
}

function projectItems(
  size: Breakpoint,
  variant: Variant,
  projectKeys: string[],
): Layout {
  const slots = PROJECT_SLOTS[variant][size];
  return projectKeys.slice(0, slots.length).map((key, index): LayoutItem => {
    const slot = slots[index];
    return {
      i: key,
      x: slot.x,
      y: scale(size, slot.y),
      w: slot.w,
      h: scale(size, slot.h),
      isResizable: IS_RESIZABLE,
    };
  });
}

function layoutForVariant(
  size: Breakpoint,
  variant: Variant,
  projectKeys: string[],
): Layout {
  return [
    ...baseItems(variant, size),
    ...projectItems(size, variant, projectKeys),
  ];
}

function imageLayout(size: Breakpoint, images: Images): Layout {
  const colsNumber = size === "xs" ? 2 : 4;
  let totalWSoFar = 0;

  return images.map((image): LayoutItem => {
    let x = 0;
    let y = 0;

    const totalW = totalWSoFar;
    if (totalW < colsNumber) {
      x = totalW;
      y = 0;
    } else if (totalW === colsNumber) {
      x = 0;
      y = 1;
    } else {
      x = Math.ceil(totalW % colsNumber);
      y = Math.floor(totalW / colsNumber);
    }

    totalWSoFar += image.width;

    return {
      i: image.src,
      x,
      y: scale(size, y),
      w: image.width,
      h: scale(size, image.height),
      isResizable: IS_RESIZABLE,
    };
  });
}

export function generateLayouts(tab: TabsType, projectKeys: string[]) {
  const variant = TAB_TO_VARIANT[tab];
  const lg = layoutForVariant("lg", variant, projectKeys);
  const sm = layoutForVariant("sm", variant, projectKeys);
  const xs = layoutForVariant("xs", variant, projectKeys);
  return withMdFromLg({ lg, sm, xs });
}

export function generateImageLayouts(images: Images) {
  const lg = imageLayout("lg", images);
  const sm = imageLayout("sm", images);
  const xs = imageLayout("xs", images);
  return withMdFromLg({ lg, sm, xs });
}
