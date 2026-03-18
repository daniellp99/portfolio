import { Images } from "@/data/project-dto";
import { getLayouts } from "@/server/layouts";
import { imageLayoutsKeyForSlug, IMAGE_LAYOUTS_KEY } from "@/utils/constants";
import Image from "next/image";
import GridContainer from "./GridContainer";
import { Card } from "./ui/card";

export default async function ImageGrid({
  slug,
  images,
}: {
  slug: string | undefined;
  images: Images;
}) {
  const imageSrcs = images.map((img) => img.src);
  const layouts = await getLayouts({
    layoutKey: IMAGE_LAYOUTS_KEY,
    projectSlug: slug,
    images,
  });
  const layoutKey = imageLayoutsKeyForSlug(slug, imageSrcs);

  return (
    <GridContainer layouts={layouts} layoutKey={layoutKey}>
      {images.map((image) => (
        <Card
          key={image.src}
          variant="item"
          className="flex size-full items-center"
        >
          <Image
            src={`/${image.src}`}
            alt={image.alt}
            fill
            sizes="50vw"
            loading="eager"
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
