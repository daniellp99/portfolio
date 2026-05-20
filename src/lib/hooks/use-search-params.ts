"use client";

import {
  getImageSearchParamsParsers,
  getMainSearchParamsParsers,
} from "@/lib/schemas/search-params";

import {
  GetImageLayoutsParams,
  GetMainLayoutsParams,
} from "@/types/search-params";
import { Options, useQueryStates } from "nuqs";
import { MAIN_LAYOUTS_KEY } from "../site/constants";

export function useSearchParams(
  props: (GetMainLayoutsParams | GetImageLayoutsParams) & Options,
) {
  const parsers =
    props.layoutKey === MAIN_LAYOUTS_KEY
      ? getMainSearchParamsParsers(props.projectSlugs)
      : getImageSearchParamsParsers(props.images);

  return useQueryStates(parsers, {
    ...props,
  });
}
