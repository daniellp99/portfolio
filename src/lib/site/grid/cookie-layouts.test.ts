import { describe, expect, it } from "bun:test";
import type { ResponsiveLayouts } from "react-grid-layout";

import { generateImageLayouts } from "./defaults";
import {
  collapseAliasBreakpointsToLogical,
  compactForCookie,
  cookieValueWithinLimit,
  expandFromCookie,
  syncLayoutsForPersistence,
} from "./cookie-layouts";

const sampleItem = {
  i: "me",
  x: 0,
  y: 1.645123,
  w: 2,
  h: 1.645,
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
      y: 1.645,
      w: 2,
      h: 1.645,
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
        { i: srcs[0]!, x: 0, y: 0, w: 1, h: 1, isResizable: false },
        { i: srcs[1]!, x: 1, y: 0, w: 1, h: 1, isResizable: false },
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
});

describe("cookieValueWithinLimit", () => {
  it("returns false when name plus value exceeds 4096", () => {
    const key = "portfolio-main-layouts";
    const value = "x".repeat(4096 - key.length + 1);
    expect(cookieValueWithinLimit(key, value)).toBe(false);
  });
});
