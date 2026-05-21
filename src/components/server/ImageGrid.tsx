import GridContainer from "@/components/GridContainer";
import { Card } from "@/components/ui/card";
import type { Images } from "@/lib/content/display";
import { getLayouts } from "@/lib/server/layouts";
import {
  IMAGE_LAYOUTS_KEY,
  imageLayoutsKeyForSlug,
} from "@/lib/site/constants";
import { imageSrcsFromImages } from "@/lib/site/grid";
import { imageGridCardSizes } from "@/lib/site/image-sizes";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function ImageGrid({
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
