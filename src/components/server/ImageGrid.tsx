import Image from "next/image";
import type { ResponsiveLayouts } from "react-grid-layout";

import { Card } from "@/components/ui/card";

import GridContainer from "@/components/GridContainer";

import type { Images } from "@/lib/content/display";
import { imageLayoutsKeyForSlug } from "@/lib/site/constants";
import { imageGridCardSizes } from "@/lib/site/image-sizes";

export default function ImageGrid({
  images,
  layouts,
  slug,
}: {
  images: Images;
  layouts: ResponsiveLayouts;
  slug: string;
}) {
  const layoutKey = imageLayoutsKeyForSlug(slug, images);
  return (
    <GridContainer layouts={layouts} layoutKey={layoutKey} images={images}>
      {images.map((image) => (
        <Card
          key={image.src}
          variant="item"
          className="relative flex size-full items-center overflow-hidden"
        >
          <Image
            src={`/${image.src}`}
            alt={image.alt}
            fill
            sizes={imageGridCardSizes(image.width)}
            quality={92}
            style={{
              objectFit: "cover",
            }}
            className="rounded-lg"
          />
        </Card>
      ))}
    </GridContainer>
  );
}
