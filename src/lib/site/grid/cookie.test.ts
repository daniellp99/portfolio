import { describe, expect, it } from "bun:test";
import type { ResponsiveLayouts } from "react-grid-layout";

import { MAIN_LAYOUTS_KEY } from "@/lib/site/constants";

import {
  collapseAliasBreakpointsToLogical,
  compactForCookie,
  cookieValueWithinLimit,
  expandFromCookie,
  normalizeLayoutsFromCookie,
  syncLayoutsForPersistence,
} from "./cookie";
import { generateImageLayouts } from "./defaults";
import { applyResizePolicyToLayouts } from "./resize-policy";

const sampleItem = {
  i: "me",
  x: 0,
  y: 3.290123,
  w: 2,
  h: 3.29,
  isResizable: false,
};

describe("compactForCookie / expandFromCookie", () => {
  it("round-trips logical breakpoints and expands md/xxs aliases", () => {
    const input: ResponsiveLayouts = {
      lg: [sampleItem],
      md: [{ i: "md-only", x: 0, y: 0, w: 1, h: 1 }],
      sm: [{ i: "sm", x: 1, y: 1, w: 1, h: 1 }],
      xs: [{ i: "xs", x: 2, y: 2, w: 1, h: 1 }],
      xxs: [{ i: "xxs-only", x: 0, y: 0, w: 1, h: 1 }],
    };
    const encoded = compactForCookie(input);
    expect(encoded).not.toContain("md");
    expect(encoded).not.toContain("xxs");
    expect(encoded).not.toContain("isResizable");

    const expanded = expandFromCookie(encoded);
    expect(expanded?.lg?.[0]).toMatchObject({
      i: "me",
      x: 0,
      y: 3.29,
      w: 2,
      h: 3.29,
    });
    expect(expanded?.md?.[0]?.i).toBe("me");
    expect(expanded?.xxs?.[0]?.i).toBe("xs");
    expect(expanded?.md?.[0]).not.toBe(expanded?.lg?.[0]);
  });

  it("rejects legacy 5-breakpoint cookies (breaking change)", () => {
    const legacy = JSON.stringify({
      lg: [sampleItem],
      md: [sampleItem],
      sm: [sampleItem],
      xs: [sampleItem],
      xxs: [sampleItem],
    });
    expect(expandFromCookie(legacy)).toBeNull();
  });

  it("remaps image src to index and back", () => {
    const srcs = ["/a.jpg", "/b.jpg"];
    const layouts: ResponsiveLayouts = {
      lg: [
        { i: "/a.jpg", x: 0, y: 0, w: 1, h: 1, isResizable: false },
        { i: "/b.jpg", x: 1, y: 0, w: 1, h: 1, isResizable: false },
      ],
    };
    const encoded = compactForCookie(layouts, { imageSrcs: srcs });
    expect(encoded).toContain('"0"');
    expect(encoded).not.toContain("/a.jpg");

    const expanded = expandFromCookie(encoded, { imageSrcs: srcs });
    expect(expanded?.lg?.map((item) => item.i)).toEqual(srcs);
  });

  it("filters main grid items to allowedLayoutIds", () => {
    const layouts: ResponsiveLayouts = {
      lg: [
        { i: "me", x: 0, y: 0, w: 1, h: 1, isResizable: false },
        { i: "proj-a", x: 1, y: 0, w: 1, h: 1, isResizable: false },
        { i: "proj-b", x: 2, y: 0, w: 1, h: 1, isResizable: false },
        { i: "proj-c", x: 3, y: 0, w: 1, h: 1, isResizable: false },
        { i: "proj-d", x: 0, y: 1, w: 1, h: 1, isResizable: false },
      ],
    };
    const allowedLayoutIds = ["me", "proj-a", "proj-b", "proj-c"];
    const encoded = compactForCookie(layouts, { allowedLayoutIds });
    const expanded = expandFromCookie(encoded);
    expect(expanded?.lg?.map((item) => item.i)).toEqual([
      "me",
      "proj-a",
      "proj-b",
      "proj-c",
    ]);
  });

  it("persists md drag into lg cookie after syncLayoutsForPersistence", () => {
    const layouts: ResponsiveLayouts = {
      lg: [{ i: "me", x: 0, y: 0, w: 1, h: 1 }],
      md: [{ i: "me", x: 0, y: 0, w: 1, h: 1 }],
      sm: [{ i: "me", x: 1, y: 1, w: 1, h: 1 }],
      xs: [{ i: "me", x: 2, y: 2, w: 1, h: 1 }],
      xxs: [{ i: "me", x: 2, y: 2, w: 1, h: 1 }],
    };
    const dragged = [{ i: "me", x: 4, y: 2, w: 1, h: 1 }];
    const synced = syncLayoutsForPersistence(dragged, "md", layouts);
    const encoded = compactForCookie(synced);
    expect(JSON.parse(encoded).lg[0].x).toBe(4);
    expect(JSON.parse(encoded).lg[0].y).toBe(2);
  });

  it("persists xxs drag into xs cookie after syncLayoutsForPersistence", () => {
    const layouts: ResponsiveLayouts = {
      lg: [{ i: "me", x: 0, y: 0, w: 1, h: 1 }],
      md: [{ i: "me", x: 0, y: 0, w: 1, h: 1 }],
      sm: [{ i: "me", x: 1, y: 1, w: 1, h: 1 }],
      xs: [{ i: "me", x: 2, y: 2, w: 1, h: 1 }],
      xxs: [{ i: "me", x: 2, y: 2, w: 1, h: 1 }],
    };
    const dragged = [{ i: "me", x: 7, y: 3, w: 1, h: 1 }];
    const synced = syncLayoutsForPersistence(dragged, "xxs", layouts);
    const encoded = compactForCookie(synced);
    expect(JSON.parse(encoded).xs[0].x).toBe(7);
    expect(JSON.parse(encoded).xs[0].y).toBe(3);
  });

  it("syncLayoutsForPersistence copies md drag into lg before save", () => {
    const layouts: ResponsiveLayouts = {
      lg: [{ i: "me", x: 0, y: 0, w: 1, h: 1 }],
      md: [{ i: "me", x: 0, y: 0, w: 1, h: 1 }],
      sm: [{ i: "me", x: 1, y: 1, w: 1, h: 1 }],
      xs: [{ i: "me", x: 2, y: 2, w: 1, h: 1 }],
      xxs: [{ i: "me", x: 2, y: 2, w: 1, h: 1 }],
    };
    const dragged = [{ i: "me", x: 3, y: 1, w: 1, h: 1 }];
    const synced = syncLayoutsForPersistence(dragged, "md", layouts);
    expect(synced.lg?.[0]?.x).toBe(3);
    expect(synced.md?.[0]?.x).toBe(3);
    const collapsed = collapseAliasBreakpointsToLogical(synced);
    expect(collapsed.lg?.[0]?.x).toBe(3);
  });

  it("keeps 15 image layouts under 4KB with long src paths", () => {
    const images = Array.from({ length: 15 }, (_, i) => ({
      alt: `image-${i}`,
      src: "/_next/image?url=" + "x".repeat(80) + i,
      width: 1,
      height: 1,
    }));
    const layouts = generateImageLayouts(images);
    const imageSrcs = images.map((image) => image.src);
    const encoded = compactForCookie(layouts, { imageSrcs });
    const key = "portfolio-image-layouts__sample_hash";
    expect(cookieValueWithinLimit(key, encoded)).toBe(true);
    expect(key.length + encoded.length).toBeLessThanOrEqual(4096);
  });

  it("encodes geometry only after resize policy is applied", () => {
    const layouts = applyResizePolicyToLayouts(
      {
        lg: [
          { i: "maps", x: 2, y: 0, w: 2, h: 4 },
          { i: "toggle-theme", x: 3, y: 4, w: 1, h: 1 },
        ],
      },
      MAIN_LAYOUTS_KEY,
    );
    const encoded = compactForCookie(layouts);
    const parsed = JSON.parse(encoded) as Record<
      string,
      Record<string, unknown>[]
    >;
    expect(encoded).not.toContain("isResizable");
    expect(encoded).not.toContain("minW");
    expect(encoded).not.toContain("minH");
    expect(encoded).not.toContain("resizeHandles");
    for (const item of parsed.lg ?? []) {
      expect(Object.keys(item).sort()).toEqual(["h", "i", "w", "x", "y"]);
    }
  });
});

describe("cookieValueWithinLimit", () => {
  it("returns false when name plus value exceeds 4096", () => {
    const key = "portfolio-main-layouts";
    const value = "x".repeat(4096 - key.length + 1);
    expect(cookieValueWithinLimit(key, value)).toBe(false);
  });
});

describe("normalizeLayoutsFromCookie", () => {
  it("fills missing canonical keys from defaults", () => {
    const defaults: ResponsiveLayouts = {
      lg: [{ i: "d-lg", x: 0, y: 0, w: 1, h: 1 }],
      md: [{ i: "d-md", x: 0, y: 0, w: 1, h: 1 }],
      sm: [{ i: "d-sm", x: 0, y: 0, w: 1, h: 1 }],
      xs: [{ i: "d-xs", x: 0, y: 0, w: 1, h: 1 }],
      xxs: [{ i: "d-xxs", x: 0, y: 0, w: 1, h: 1 }],
    };
    const decoded: ResponsiveLayouts = {
      sm: [{ i: "user-sm", x: 2, y: 2, w: 1, h: 1 }],
      extra: [{ i: "x", x: 0, y: 0, w: 1, h: 1 }],
    };
    const out = normalizeLayoutsFromCookie(decoded, defaults);
    expect(out.extra).toBeUndefined();
    expect(out.sm?.[0]?.i).toBe("user-sm");
    expect(out.lg?.[0]?.i).toBe("d-lg");
    expect(out.xxs?.[0]?.i).toBe("d-xxs");
  });

  it("reuses expanded layouts without a second clone", () => {
    const defaults: ResponsiveLayouts = {
      lg: [{ i: "d-lg", x: 0, y: 0, w: 1, h: 1 }],
      md: [{ i: "d-md", x: 0, y: 0, w: 1, h: 1 }],
    };
    const expanded: ResponsiveLayouts = {
      lg: [{ i: "user-lg", x: 1, y: 1, w: 1, h: 1 }],
      md: [{ i: "user-lg", x: 1, y: 1, w: 1, h: 1 }],
    };
    const out = normalizeLayoutsFromCookie(expanded, defaults);
    expect(out.lg).toBe(expanded.lg);
    expect(out.md).toBe(expanded.md);
    expect(out.lg?.[0]?.i).toBe("user-lg");
  });
});
