"use client";

import { Images } from "@/data/project-dto";
import Image from "next/image";
import { Layouts } from "react-grid-layout";
import GridContainer from "./GridContainer";
import { Card } from "./ui/card";

export default function ImageGrid({
  layouts,
  images,
}: {
  layouts: Layouts;
  images: Images;
}) {
  return (
    <GridContainer layouts={layouts}>
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
            style={{
              objectFit: "cover",
            }}
            className=" rounded-lg"
          />
        </Card>
      ))}
    </GridContainer>
  );
}
