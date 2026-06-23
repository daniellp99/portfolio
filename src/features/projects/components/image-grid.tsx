import { cookies } from "next/headers";
import Image from "next/image";

import { Card } from "@/components/ui/card";

import { GridContainer } from "@/features/home/components/grid-container";
import { getLayouts } from "@/features/home/home-queries";
import { imageSrcsFromImages } from "@/lib/site/grid";
import type { Images } from "@/lib/content/display";
import {
  IMAGE_LAYOUTS_KEY,
  imageLayoutsKeyForSlug,
} from "@/lib/site/constants";
import { imageGridCardSizes } from "@/lib/site/image-sizes";

export async function ImageGrid({
  slug,
  images,
}: {
  slug: string | undefined;
  images: Images;
}) {
  const cookieStore = await cookies();

  const layouts = await getLayouts(
    {
      layoutKey: IMAGE_LAYOUTS_KEY,
      projectSlug: slug,
      images,
    },
    cookieStore,
  );
  const layoutKey = imageLayoutsKeyForSlug(slug, images);

  return (
    <GridContainer
      layouts={layouts}
      layoutKey={layoutKey}
      imageSrcs={imageSrcsFromImages(images)}
    >
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
