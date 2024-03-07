const TABS = {
  ALL: "All",
  ABOUT: "About",
  PROJECTS: "Projects",
} as const;

export type TabsType = (typeof TABS)[keyof typeof TABS];

export const tabs: TabsType[] = Object.values(TABS).map(
  (tab) => tab as TabsType,
);
