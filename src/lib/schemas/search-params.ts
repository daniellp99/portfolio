import {
  serializeLayoutsForCompare,
  toDecodedLayouts,
} from "@/lib/actions/layout-payload";
import type { Images, ProjectSlugs } from "@/lib/content/display";
import {
  decodeLayoutParamSafe,
  encodeLayoutParam,
} from "@/lib/schemas/layout-delta";
import type { DecodedLayouts } from "@/lib/schemas/layouts";
import { generateImageLayouts, generateLayouts } from "@/lib/site/grid";
import { isTabsType, type TabsType } from "@/lib/site/tabs";
import { createLoader, createParser, type SearchParams } from "nuqs/server";

export const tabParser = createParser<TabsType>({
  parse(query) {
    return isTabsType(query) ? query : null;
  },
  serialize(value) {
    return value;
  },
}).withDefault("All");

/** Set before `setSearchParams({ layout })` so md/xxs drags map to lg/xs. */
let layoutEncodeBreakpoint: string | undefined;

export function setLayoutEncodeBreakpoint(breakpoint: string | undefined) {
  layoutEncodeBreakpoint = breakpoint;
}

function readTabFromClientUrl(): TabsType {
  if (typeof window === "undefined") return "All";
  const raw = new URLSearchParams(window.location.search).get("tab");
  return tabParser.parse(raw ?? "") ?? "All";
}

function createMainLayoutParser(projectSlugs: ProjectSlugs, tab: TabsType) {
  const baseline = toDecodedLayouts(generateLayouts(tab, projectSlugs));

  return createParser<DecodedLayouts>({
    parse(query) {
      if (!query) return null;
      return decodeLayoutParamSafe(query, baseline) ?? null;
    },
    serialize(value) {
      return encodeLayoutParam(value, baseline, layoutEncodeBreakpoint) ?? "";
    },
    eq(a, b) {
      return serializeLayoutsForCompare(a) === serializeLayoutsForCompare(b);
    },
  })
    .withDefault(baseline)
    .withOptions({ clearOnDefault: true });
}

function createImageLayoutParser(images: Images) {
  const baseline = toDecodedLayouts(generateImageLayouts(images));

  return createParser<DecodedLayouts>({
    parse(query) {
      if (!query) return null;
      return decodeLayoutParamSafe(query, baseline) ?? null;
    },
    serialize(value) {
      return encodeLayoutParam(value, baseline, layoutEncodeBreakpoint) ?? "";
    },
    eq(a, b) {
      return serializeLayoutsForCompare(a) === serializeLayoutsForCompare(b);
    },
  })
    .withDefault(baseline)
    .withOptions({ clearOnDefault: true });
}

export function getMainSearchParamsParsers(
  projectSlugs: ProjectSlugs,
  tab: TabsType = readTabFromClientUrl(),
) {
  return {
    tab: tabParser,
    layout: createMainLayoutParser(projectSlugs, tab),
  };
}

export function getImageSearchParamsParsers(images: Images) {
  return {
    layout: createImageLayoutParser(images),
  };
}

const loadTab = createLoader({ tab: tabParser });

export const loadMainSearchParams = (projectSlugs: ProjectSlugs) => {
  return async (searchParams: Promise<SearchParams>) => {
    const { tab } = await loadTab(searchParams);
    return createLoader({
      tab: tabParser,
      layout: createMainLayoutParser(projectSlugs, tab),
    })(searchParams);
  };
};

export const loadImageSearchParams = (images: Images) =>
  createLoader({
    layout: createImageLayoutParser(images),
  });
