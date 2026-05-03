import GridContainer from "@/components/GridContainer";
import { Card } from "@/components/ui/card";
import { getLayouts } from "@/lib/server/layouts";
import type { Images } from "@/lib/content/display";
import {
  IMAGE_LAYOUTS_KEY,
  imageLayoutsKeyForSlug,
} from "@/lib/site/constants";
import { imageGridCardSizes } from "@/lib/site/image-sizes";
import Image from "next/image";

export default async function ImageGrid({
  slug,
  images,
}: {
  slug: string | undefined;
  images: Images;
}) {
  const layouts = await getLayouts({
    layoutKey: IMAGE_LAYOUTS_KEY,
    projectSlug: slug,
    images,
  });
  const layoutKey = imageLayoutsKeyForSlug(slug, images);

  return (
    <GridContainer layouts={layouts} layoutKey={layoutKey}>
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
