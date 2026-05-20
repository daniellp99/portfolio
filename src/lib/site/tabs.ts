const TABS = {
  ALL: "All",
  ABOUT: "About",
  PROJECTS: "Projects",
} as const;

export type TabsType = (typeof TABS)[keyof typeof TABS];

export const tabs: TabsType[] = Object.values(TABS).map(
  (tab) => tab as TabsType,
);

const tabSet = new Set<string>(tabs);

export function isTabsType(value: string): value is TabsType {
  return tabSet.has(value);
}
