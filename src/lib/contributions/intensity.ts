export function intensityBucket(count: number, max: number) {
  if (count <= 0 || max <= 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export function bucketClass(bucket: number) {
  switch (bucket) {
    case 0:
      return "bg-foreground/5";
    case 1:
      return "bg-foreground/20";
    case 2:
      return "bg-foreground/40";
    case 3:
      return "bg-foreground/60";
    default:
      return "bg-foreground/80";
  }
}
