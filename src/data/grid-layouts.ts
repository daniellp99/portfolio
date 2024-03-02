import { Layout } from "react-grid-layout";
import { getProjectSlugsDTO } from "./project-dto";

interface LayoutFactory {
  generateLayout(size: "lg" | "sm" | "xs"): Promise<Layout[]>;
}

class DefaultLayoutFactory implements LayoutFactory {
  async generateLayout(size: "lg" | "sm" | "xs"): Promise<Layout[]> {
    const sizeFactor = { lg: 1.645, sm: 1.09, xs: 1 }[size];

    const projectKeys = await getProjectSlugsDTO();
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
        isResizable: false,
      },
      {
        i: "toggle-theme",
        x: size === "xs" ? 1 : 3,
        y: sizeFactor * (size === "xs" ? 5 : 2),
        w: 1,
        h: sizeFactor * 1,
        isResizable: false,
      },
      {
        i: "maps",
        x: size === "xs" ? 0 : 2,
        y: sizeFactor * (size === "xs" ? 2 : 0),
        w: size === "xs" ? 2 : 1,
        h: sizeFactor * 1,
        isResizable: false,
      },
      {
        i: "social-links",
        x: size === "xs" ? 0 : size === "sm" ? 2 : 1,
        y: sizeFactor * (size === "xs" ? 3 : 1),
        w: 1,
        h: sizeFactor * 1,
        isResizable: false,
      },
    ].concat(
      projectKeys.length > 0 && projectKeys.length <= projectSlots.length
        ? projectKeys.map((key, index) => {
            return {
              i: key,
              x: projectSlots[index].x,
              y: sizeFactor * projectSlots[index].y,
              w: projectSlots[index].w,
              h: sizeFactor * projectSlots[index].h,
              isResizable: false,
            };
          })
        : [],
    );
  }
}

export async function generateDefaultLayouts() {
  const defaultLayoutFactory = new DefaultLayoutFactory();

  const lgLayout = await defaultLayoutFactory.generateLayout("lg");
  const smLayout = await defaultLayoutFactory.generateLayout("sm");
  const xsLayout = await defaultLayoutFactory.generateLayout("xs");

  return {
    lg: lgLayout,
    md: lgLayout,
    sm: smLayout,
    xs: xsLayout,
  };
}
