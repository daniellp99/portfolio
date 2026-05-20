import "server-only";

import { ImageLayoutsKey, MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import {
  generateImageLayouts,
  generateLayouts,
  normalizeLayouts,
} from "@/lib/site/grid";
import {
  GetImageLayoutsParams,
  GetMainLayoutsParams,
} from "@/types/search-params";
import type { ResponsiveLayouts } from "react-grid-layout";
import { DecodedLayouts } from "../schemas/layouts";

export function getLayoutsFromSearchParams(
  params: (GetMainLayoutsParams | GetImageLayoutsParams) & {
    layout: DecodedLayouts;
  },
): ResponsiveLayouts {
  let defaultLayouts: ResponsiveLayouts = {};
  switch (params.layoutKey) {
    case MAIN_LAYOUTS_KEY:
      defaultLayouts = generateLayouts(params.tab, params.projectSlugs);
      break;
    case params.layoutKey as ImageLayoutsKey:
      defaultLayouts = generateImageLayouts(params.images);
      break;
  }
  return normalizeLayouts(params.layout, defaultLayouts);
}
