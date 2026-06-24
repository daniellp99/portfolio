import { gridSectionInitialWidth } from "@/lib/site/grid";

const MOBILE_UA_RE =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i;

/** Estimate viewport width from request headers (SSR / Lighthouse). */
export function viewportWidthFromHeaders(headers: Headers): number {
  const clientHint = headers.get("sec-ch-viewport-width");
  if (clientHint) {
    const parsed = Number.parseInt(clientHint, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const ua = headers.get("user-agent") ?? "";
  if (MOBILE_UA_RE.test(ua)) {
    return 390;
  }

  return 1350;
}

export function gridInitialWidthFromHeaders(headers: Headers): number {
  return gridSectionInitialWidth(viewportWidthFromHeaders(headers));
}
