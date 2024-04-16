"use server";

import {
  AboutLayoutFactory,
  DefaultLayoutFactory,
  ImageLayoutFactory,
  ProjectsLayoutFactory,
} from "./data/grid-layouts";
import { Images } from "./data/project-dto";
import { TabsType } from "./types/tabs";

const layoutFactories = {
  All: new DefaultLayoutFactory(),
  Projects: new ProjectsLayoutFactory(),
  About: new AboutLayoutFactory(),
};

export async function generateLayouts(tab: TabsType) {
  const LayoutFactory = layoutFactories[tab] || new DefaultLayoutFactory();

  const lgLayout = await LayoutFactory.generateLayout("lg");
  const smLayout = await LayoutFactory.generateLayout("sm");
  const xsLayout = await LayoutFactory.generateLayout("xs");

  return {
    lg: lgLayout,
    md: lgLayout,
    sm: smLayout,
    xs: xsLayout,
  };
}
export async function generateImageLayouts(images: Images) {
  const LayoutFactory = new ImageLayoutFactory(images);

  const lgLayout = await LayoutFactory.generateLayout("lg");
  const smLayout = await LayoutFactory.generateLayout("sm");
  const xsLayout = await LayoutFactory.generateLayout("xs");

  return {
    lg: lgLayout,
    md: lgLayout,
    sm: smLayout,
    xs: xsLayout,
  };
}
