import { describe, expect, it } from "bun:test";

import { bucketClass, intensityBucket } from "./intensity";

describe("intensityBucket", () => {
  it("returns 0 when max is 0", () => {
    expect(intensityBucket(5, 0)).toBe(0);
  });

  it("buckets by ratio quartiles", () => {
    expect(intensityBucket(1, 100)).toBe(1);
    expect(intensityBucket(30, 100)).toBe(2);
    expect(intensityBucket(60, 100)).toBe(3);
    expect(intensityBucket(90, 100)).toBe(4);
  });
});

describe("bucketClass", () => {
  it("returns tailwind classes for buckets 0-4", () => {
    expect(bucketClass(0)).toContain("foreground");
    expect(bucketClass(4)).toContain("foreground");
  });
});
