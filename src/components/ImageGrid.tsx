import { Images } from "@/data/project-dto";
import { getLayouts } from "@/server/layouts";
import { IMAGE_LAYOUTS_KEY } from "@/utils/constants";
import Image from "next/image";
import GridContainer from "./GridContainer";
import { Card } from "./ui/card";

export default async function ImageGrid({ images }: { images: Images }) {
  const layouts = await getLayouts({
    layoutKey: IMAGE_LAYOUTS_KEY,
    images: images,
  });
  return (
    <GridContainer layouts={layouts} layoutKey={IMAGE_LAYOUTS_KEY}>
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
