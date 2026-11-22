export function brandTitle(ownerName: string | null | undefined): string {
  const n = ownerName ?? "";
  return n ? `${n}'s Portfolio` : "Portfolio";
}
