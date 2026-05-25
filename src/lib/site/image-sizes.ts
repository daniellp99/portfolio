/**
 * `sizes` for next/image fill on **single-column** main-grid project tiles
 * (2 cols &lt;768px, 4 cols ≥768px; containers max 375 / 800 / 1200px).
 *
 * Slot width ≈ column − 36px (`border-2` + `px-4` on the cover image).
 */
export const MAIN_GRID_CARD_IMAGE_SIZES =
  "(max-width: 767px) 128px, (max-width: 1199px) 144px, 244px";

/**
 * `sizes` for project detail {@link ImageGrid}: MDX `width` is RGL column span,
 * so multi-column screenshots need larger intrinsic widths than {@link MAIN_GRID_CARD_IMAGE_SIZES}.
 */
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
