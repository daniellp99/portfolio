import { describe, expect, it } from "bun:test";

import {
  openGraphArticleFragment,
  openGraphWebsiteFragment,
  twitterSummaryLargeImage,
} from "./fragments";

describe("openGraphWebsiteFragment", () => {
  it("sets website Open Graph fields", () => {
    const og = openGraphWebsiteFragment({
      url: "https://example.com/",
      siteName: "Pat's Portfolio",
      title: "Pat's Portfolio",
      description: "About me",
    });
    expect(og).toMatchObject({
      type: "website",
      locale: "en_US",
      url: "https://example.com/",
      siteName: "Pat's Portfolio",
      title: "Pat's Portfolio",
      description: "About me",
    });
  });
});

describe("openGraphArticleFragment", () => {
  it("sets article Open Graph fields", () => {
    const og = openGraphArticleFragment({
      url: "https://example.com/project/foo",
      siteName: "Pat's Portfolio",
      title: "Foo",
      description: "A project",
    });
    expect(og).toMatchObject({
      type: "article",
      url: "https://example.com/project/foo",
      title: "Foo",
    });
  });

  it("includes image url and alt when provided", () => {
    const og = openGraphArticleFragment({
      url: "https://example.com/project/foo",
      siteName: "Pat's Portfolio",
      title: "Foo",
      description: "A project",
      imageUrl: "https://example.com/project/foo/opengraph-image",
      imageAlt: "Foo",
    });
    expect(og.images).toEqual([
      {
        url: "https://example.com/project/foo/opengraph-image",
        alt: "Foo",
      },
    ]);
  });
});

describe("twitterSummaryLargeImage", () => {
  it("omits creator when not provided", () => {
    const tw = twitterSummaryLargeImage({
      title: "T",
      description: "D",
    });
    expect(tw).toMatchObject({
      card: "summary_large_image",
      title: "T",
      description: "D",
    });
    expect("creator" in tw).toBe(false);
  });

  it("includes creator when provided", () => {
    const tw = twitterSummaryLargeImage({
      title: "T",
      description: "D",
      creator: "@pat",
    });
    expect(tw).toMatchObject({ creator: "@pat" });
  });

  it("includes image when provided", () => {
    const tw = twitterSummaryLargeImage({
      title: "T",
      description: "D",
      imageUrl: "https://example.com/og.png",
    });
    expect(tw.images).toEqual(["https://example.com/og.png"]);
  });
});
