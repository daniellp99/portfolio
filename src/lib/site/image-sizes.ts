export const MAIN_GRID_CARD_IMAGE_SIZES =
  "(max-width: 767px) 128px, (max-width: 1199px) 144px, 244px";

export const PROJECT_DETAIL_COVER_IMAGE_SIZES =
  "(max-width: 639px) 100vw, 28rem";

export function imageGridCardSizes(columnSpan: number): string {
  const span = Math.min(Math.max(Math.round(columnSpan), 1), 4);

  const xs = span === 1 ? "calc(50vw - 20px)" : "calc(100vw - 32px)";
  const smThroughLg =
    span === 1
      ? "calc(25vw - 16px)"
      : span === 2
        ? "calc(50vw - 24px)"
        : span === 3
          ? "calc(75vw - 32px)"
          : "calc(100vw - 40px)";
  const xlFixed =
    span === 1
      ? "244px"
      : span === 2
        ? "588px"
        : span === 3
          ? "880px"
          : "1140px";

  return `(max-width: 767px) ${xs}, (max-width: 1199px) ${smThroughLg}, ${xlFixed}`;
}
