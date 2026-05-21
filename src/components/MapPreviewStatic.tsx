import Image from "next/image";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/site/constants";
import { cartoTileUrl, latLngToTile, parseCenter } from "@/lib/site/map-tile";

function previewTileUrl(variant: "dark" | "light"): string {
  const { lat, lng } = parseCenter(DEFAULT_CENTER);
  const { z, x, y } = latLngToTile(lat, lng, DEFAULT_ZOOM);
  return cartoTileUrl(variant, z, x, y);
}

export default function MapPreviewStatic() {
  const darkSrc = previewTileUrl("dark");
  const lightSrc = previewTileUrl("light");

  return (
    <>
      <Image
        src={darkSrc}
        alt="Map preview"
        fill
        sizes="33vw"
        priority
        fetchPriority="high"
        className="absolute inset-0 hidden size-full object-cover dark:block"
      />
      <Image
        src={lightSrc}
        alt="Map preview"
        fill
        sizes="33vw"
        priority
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover dark:hidden"
      />
    </>
  );
}
