import {
  AboutLayoutFactory,
  DefaultLayoutFactory,
  ImageLayoutFactory,
  ProjectsLayoutFactory,
} from "@/data/grid-layouts";
import { Images } from "@/data/project-dto";
import { TabsType } from "@/types/tabs";

const layoutFactories = {
  All: DefaultLayoutFactory,
  Projects: ProjectsLayoutFactory,
  About: AboutLayoutFactory,
};

export function generateLayouts(tab: TabsType, projectKeys: string[]) {
  const LayoutFactory = layoutFactories[tab] || DefaultLayoutFactory;

  const instance = new LayoutFactory(projectKeys);

  const lgLayout = instance.generateLayout("lg");
  const smLayout = instance.generateLayout("sm");
  const xsLayout = instance.generateLayout("xs");

  return {
    lg: lgLayout,
    md: lgLayout,
    sm: smLayout,
    xs: xsLayout,
  };
}
export function generateImageLayouts(images: Images) {
  const LayoutFactory = new ImageLayoutFactory(images);

  const lgLayout = LayoutFactory.generateLayout("lg");
  const smLayout = LayoutFactory.generateLayout("sm");
  const xsLayout = LayoutFactory.generateLayout("xs");

  return {
    lg: lgLayout,
    md: lgLayout,
    sm: smLayout,
    xs: xsLayout,
  };
}
