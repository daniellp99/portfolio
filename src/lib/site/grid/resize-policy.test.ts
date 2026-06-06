import { describe, expect, it } from "bun:test";

import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";

import {
  ALL_RESIZE_HANDLES,
  applyResizePolicyToLayoutItem,
  applyResizePolicyToLayouts,
  MAP_LAYOUT_ITEM_ID,
} from "./resize-policy";

describe("applyResizePolicyToLayoutItem", () => {
  it("makes maps resizable with all handles and min 1x1 on main grid", () => {
    const out = applyResizePolicyToLayoutItem(
      { i: MAP_LAYOUT_ITEM_ID, x: 2, y: 0, w: 1, h: 1 },
      "main",
      4,
    );
    expect(out.isResizable).toBe(true);
    expect(out.resizeHandles).toEqual([...ALL_RESIZE_HANDLES]);
    expect(out.minW).toBe(1);
    expect(out.minH).toBe(1);
  });

  it("clamps map w to cols and h to at least 1", () => {
    const out = applyResizePolicyToLayoutItem(
      { i: MAP_LAYOUT_ITEM_ID, x: 0, y: 0, w: 5, h: 0.5 },
      "main",
      2,
    );
    expect(out.w).toBe(2);
    expect(out.h).toBe(1);
  });

  it("keeps toggle-theme at h 0.5 without min constraints", () => {
    const out = applyResizePolicyToLayoutItem(
      { i: "toggle-theme", x: 3, y: 2, w: 1, h: 0.5 },
      "main",
      4,
    );
    expect(out.isResizable).toBe(false);
    expect(out.minW).toBeUndefined();
    expect(out.minH).toBeUndefined();
    expect(out.h).toBe(0.5);
  });

  it("strips legacy min/max and isResizable from non-map items", () => {
    const out = applyResizePolicyToLayoutItem(
      {
        i: "me",
        x: 0,
        y: 0,
        w: 2,
        h: 1,
        isResizable: true,
        minW: 1,
        minH: 1,
        maxW: 4,
      },
      "main",
      4,
    );
    expect(out.isResizable).toBe(false);
    expect(out.minW).toBeUndefined();
    expect(out.minH).toBeUndefined();
    expect(out.maxW).toBeUndefined();
  });

  it("marks image grid items non-resizable", () => {
    const out = applyResizePolicyToLayoutItem(
      { i: "/photo.jpg", x: 0, y: 0, w: 1, h: 1 },
      "image",
      4,
    );
    expect(out.isResizable).toBe(false);
    expect(out.resizeHandles).toBeUndefined();
  });

  it("adds resizable flags to map missing isResizable from cookie geometry", () => {
    const out = applyResizePolicyToLayoutItem(
      { i: MAP_LAYOUT_ITEM_ID, x: 2, y: 0, w: 2, h: 2 },
      "main",
      4,
    );
    expect(out.isResizable).toBe(true);
    expect(out.w).toBe(2);
    expect(out.h).toBe(2);
  });
});

describe("applyResizePolicyToLayouts", () => {
  it("applies policy per canonical breakpoint", () => {
    const layouts = applyResizePolicyToLayouts(
      {
        lg: [
          { i: MAP_LAYOUT_ITEM_ID, x: 2, y: 0, w: 1, h: 1 },
          { i: "toggle-theme", x: 3, y: 2, w: 1, h: 0.5 },
        ],
        md: [
          { i: MAP_LAYOUT_ITEM_ID, x: 2, y: 0, w: 1, h: 1 },
          { i: "toggle-theme", x: 3, y: 2, w: 1, h: 0.5 },
        ],
      },
      MAIN_LAYOUTS_KEY,
    );
    expect(layouts.lg?.[0]?.isResizable).toBe(true);
    expect(layouts.lg?.[1]?.h).toBe(0.5);
    expect(layouts.md?.[0]?.isResizable).toBe(true);
  });
});
