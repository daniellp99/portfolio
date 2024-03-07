"use server";

import {
  AboutLayoutFactory,
  DefaultLayoutFactory,
  ProjectsLayoutFactory,
} from "./data/grid-layouts";
import { TabsType } from "./types/tabs";

export async function generateLayouts(tab: TabsType) {
  const layoutFactories = {
    All: new DefaultLayoutFactory(),
    Projects: new ProjectsLayoutFactory(),
    About: new AboutLayoutFactory(),
  };

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
