import { Images, ProjectSlugs } from "@/lib/content/display";
import { ImageLayoutsKey, MAIN_LAYOUTS_KEY } from "@/lib/site/constants";
import { TabsType } from "@/lib/site/tabs";

export type GetMainLayoutsParams = {
  layoutKey: typeof MAIN_LAYOUTS_KEY;
  tab: TabsType;
  projectSlugs: ProjectSlugs;
};

export type GetImageLayoutsParams = {
  layoutKey: ImageLayoutsKey;
  images: Images;
};
