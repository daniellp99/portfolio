import { describe, expect, it } from "bun:test";

import { mapOwnerToMapMarkerInfo } from "./map-marker";
import type { OwnerData } from "./schemas";

describe("mapOwnerToMapMarkerInfo", () => {
  it("returns null for null owner", () => {
    expect(mapOwnerToMapMarkerInfo(null)).toBeNull();
  });

  it("maps marker fields", () => {
    const owner = {
      name: "n",
      email: "a@b.co",
      journeyStartAt: "2020-01-01T00:00:00Z",
      githubUser: "g",
      aboutMe: "a",
      avatar: "https://example.com/a.webp",
      avatarMarker: "https://example.com/m1.webp",
      avatarMarkerHover: "https://example.com/m2.webp",
      avatarMarkerTooltip: "tip",
      skills: [],
    } satisfies OwnerData;

    expect(mapOwnerToMapMarkerInfo(owner)).toEqual({
      avatarMarker: "https://example.com/m1.webp",
      avatarMarkerHover: "https://example.com/m2.webp",
      avatarMarkerTooltip: "tip",
    });
  });
});
