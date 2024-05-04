import { Layout } from "react-grid-layout";
import { Images } from "./project-dto";

interface LayoutFactory {
  generateLayout(size: "lg" | "sm" | "xs"): Layout[];
}

const scaleFactor = { lg: 1.645, sm: 1.09, xs: 1 };
const isResizable = false;
export class DefaultLayoutFactory implements LayoutFactory {
  private projectKeys: string[];

  constructor(projectKeys: string[]) {
    this.projectKeys = projectKeys;
  }
  generateLayout(size: "lg" | "sm" | "xs"): Layout[] {
    const sizeFactor = scaleFactor[size];

    const projectSlots = {
      lg: [
        { x: 3, y: 0, w: 1, h: 2 },
        { x: 0, y: 1, w: 2, h: 1 },
        { x: 2, y: 1, w: 1, h: 2 },
      ],
      sm: [
        { x: 3, y: 0, w: 1, h: 2 },
        { x: 0, y: 2, w: 2, h: 1 },
        { x: 2, y: 2, w: 1, h: 2 },
      ],
      xs: [
        { x: 1, y: 3, w: 1, h: 2 },
        { x: 0, y: 6, w: 2, h: 1 },
        { x: 0, y: 4, w: 1, h: 2 },
      ],
    }[size];

    return [
      {
        i: "me",
        x: 0,
        y: 0,
        w: 2,
        h: sizeFactor * (size === "lg" ? 1 : 2),
        isResizable,
      },
      {
        i: "toggle-theme",
        x: size === "xs" ? 1 : 3,
        y: sizeFactor * (size === "xs" ? 5 : 2),
        w: 1,
        h: sizeFactor * 1,
        isResizable,
      },
      {
        i: "maps",
        x: size === "xs" ? 0 : 2,
        y: sizeFactor * (size === "xs" ? 2 : 0),
        w: size === "xs" ? 2 : 1,
        h: sizeFactor * 1,
        isResizable,
      },
      {
        i: "social-links",
        x: size === "xs" ? 0 : size === "sm" ? 2 : 1,
        y: sizeFactor * (size === "xs" ? 3 : 1),
        w: 1,
        h: sizeFactor * 1,
        isResizable,
      },
    ].concat(
      this.projectKeys.length > 0 &&
        this.projectKeys.length <= projectSlots.length
        ? this.projectKeys.map((key, index) => {
            return {
              i: key,
              x: projectSlots[index].x,
              y: sizeFactor * projectSlots[index].y,
              w: projectSlots[index].w,
              h: sizeFactor * projectSlots[index].h,
              isResizable,
            };
          })
        : [],
    );
  }
}

export class AboutLayoutFactory implements LayoutFactory {
  private projectKeys: string[];

  constructor(projectKeys: string[]) {
    this.projectKeys = projectKeys;
  }
  generateLayout(size: "lg" | "sm" | "xs"): Layout[] {
    const sizeFactor = scaleFactor[size];

    const projectSlots = {
      lg: [
        { x: 3, y: 1, w: 1, h: 2 },
        { x: 0, y: 3, w: 2, h: 1 },
        { x: 2, y: 1, w: 1, h: 2 },
      ],
      sm: [
        { x: 3, y: 1, w: 1, h: 2 },
        { x: 2, y: 3, w: 2, h: 1 },
        { x: 2, y: 1, w: 1, h: 2 },
      ],
      xs: [
        { x: 1, y: 3, w: 1, h: 2 },
        { x: 0, y: 10, w: 2, h: 1 },
        { x: 0, y: 4, w: 1, h: 2 },
      ],
    }[size];

    return [
      {
        i: "me",
        x: 0,
        y: sizeFactor * (size === "xs" ? 1 : 0),
        w: 2,
        h: sizeFactor * (size === "lg" ? 1 : 2),
        isResizable,
      },
      {
        i: "toggle-theme",
        x: 1,
        y: sizeFactor * (size === "lg" ? 1 : 5),
        w: 1,
        h: sizeFactor * 1,
        isResizable,
      },
      {
        i: "maps",
        x: size === "xs" ? 0 : 2,
        y: 0,
        w: size === "xs" ? 2 : 1,
        h: sizeFactor * 1,
        isResizable,
      },
      {
        i: "social-links",
        x: size === "xs" ? 0 : 3,
        y: sizeFactor * (size === "xs" ? 3 : 0),
        w: 1,
        h: sizeFactor * 1,
        isResizable,
      },
    ].concat(
      this.projectKeys.length > 0 &&
        this.projectKeys.length <= projectSlots.length
        ? this.projectKeys.map((key, index) => {
            return {
              i: key,
              x: projectSlots[index].x,
              y: sizeFactor * projectSlots[index].y,
              w: projectSlots[index].w,
              h: sizeFactor * projectSlots[index].h,
              isResizable,
            };
          })
        : [],
    );
  }
}
export class ProjectsLayoutFactory implements LayoutFactory {
  private projectKeys: string[];

  constructor(projectKeys: string[]) {
    this.projectKeys = projectKeys;
  }
  generateLayout(size: "lg" | "sm" | "xs"): Layout[] {
    const sizeFactor = scaleFactor[size];

    const projectSlots = {
      lg: [
        { x: 2, y: 0, w: 1, h: 2 },
        { x: 0, y: 0, w: 2, h: 1 },
        { x: 3, y: 0, w: 1, h: 2 },
      ],
      sm: [
        { x: 2, y: 0, w: 1, h: 2 },
        { x: 0, y: 0, w: 2, h: 1 },
        { x: 3, y: 0, w: 1, h: 2 },
      ],
      xs: [
        { x: 1, y: 0, w: 1, h: 2 },
        { x: 0, y: 2, w: 2, h: 1 },
        { x: 0, y: 0, w: 1, h: 2 },
      ],
    }[size];

    return [
      {
        i: "me",
        x: 0,
        y: sizeFactor * (size === "xs" ? 4 : 1),
        w: 2,
        h: sizeFactor * (size === "lg" ? 1 : 2),
        isResizable,
      },
      {
        i: "toggle-theme",
        x: size === "sm" ? 2 : 1,
        y: sizeFactor * (size === "xs" ? 6 : size === "sm" ? 5 : 2),
        w: 1,
        h: sizeFactor * 1,
        isResizable,
      },
      {
        i: "maps",
        x: size === "xs" ? 0 : 2,
        y: sizeFactor * (size === "xs" ? 3 : 2),
        w: size === "xs" ? 2 : 1,
        h: sizeFactor * 1,
        isResizable,
      },
      {
        i: "social-links",
        x: size === "xs" ? 0 : 3,
        y: sizeFactor * (size === "xs" ? 6 : 2),
        w: 1,
        h: sizeFactor * 1,
        isResizable,
      },
    ].concat(
      this.projectKeys.length > 0 &&
        this.projectKeys.length <= projectSlots.length
        ? this.projectKeys.map((key, index) => {
            return {
              i: key,
              x: projectSlots[index].x,
              y: sizeFactor * projectSlots[index].y,
              w: projectSlots[index].w,
              h: sizeFactor * projectSlots[index].h,
              isResizable,
            };
          })
        : [],
    );
  }
}

export class ImageLayoutFactory implements LayoutFactory {
  private images: Images;

  constructor(images: Images) {
    this.images = images;
  }
  generateLayout(size: "lg" | "sm" | "xs"): Layout[] {
    const sizeFactor = scaleFactor[size];
    const colsNumber = size === "xs" ? 2 : 4;

    if (this.images.length > 0) {
      return Array.from(
        this.images.map((image, index, array) => {
          let x = 0, // 0,1,2,3
            y = 0;
          let prevImages = array.slice(0, index);

          if (prevImages.length === 0) {
            x = 0;
            y = 0;
          } else {
            let totalW = 0;
            prevImages.forEach((image) => {
              totalW += image.width;
            });

            if (totalW < colsNumber) {
              x = totalW;
              y = 0;
            } else if (totalW === colsNumber) {
              x = 0;
              y = 1;
            } else {
              x = Math.ceil(totalW % colsNumber);
              y = Math.floor(totalW / colsNumber);
            }
          }

          return {
            i: image.src,
            x: x,
            y: sizeFactor * y,
            w: image.width,
            h: sizeFactor * image.height,
            isResizable,
          };
        }),
      );
    } else {
      return [];
    }
  }
}
