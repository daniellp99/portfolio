/**
 * Portfolio brand string derived from owner display name (metadata, OG, titles).
 */
export function brandTitle(ownerName: string | null | undefined): string {
  const n = ownerName ?? "";
  return n ? `${n}'s Portfolio` : "Portfolio";
}
