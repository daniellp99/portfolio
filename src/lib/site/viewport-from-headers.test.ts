import { describe, expect, test } from "bun:test";

import {
  gridInitialWidthFromHeaders,
  viewportWidthFromHeaders,
} from "./viewport-from-headers";

describe("viewportWidthFromHeaders", () => {
  test("prefers sec-ch-viewport-width", () => {
    const headers = new Headers({ "sec-ch-viewport-width": "412" });
    expect(viewportWidthFromHeaders(headers)).toBe(412);
  });

  test("uses mobile UA heuristic", () => {
    const headers = new Headers({
      "user-agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    });
    expect(viewportWidthFromHeaders(headers)).toBe(390);
  });

  test("defaults to desktop width", () => {
    const headers = new Headers({
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    });
    expect(viewportWidthFromHeaders(headers)).toBe(1350);
  });
});

describe("gridInitialWidthFromHeaders", () => {
  test("caps desktop viewport to grid section max", () => {
    const headers = new Headers({
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    });
    expect(gridInitialWidthFromHeaders(headers)).toBe(1200);
  });
});
