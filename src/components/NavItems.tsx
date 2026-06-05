"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  startTransition,
  useActionState,
  useOptimistic,
  useRef,
  type SubmitEvent,
} from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { capture } from "@/lib/analytics";
import {
  switchMainGridTabFormAction,
  type MainGridTabFormState,
} from "@/lib/actions/switch-main-grid-tab-form";
import { UI_SPRING } from "@/lib/motion";
import { MAIN_GRID_TABPANEL_ID } from "@/lib/site/constants";
import { tabs, tabsTypeSchema, type TabsType } from "@/lib/site/tabs";
import { cn } from "@/lib/utils";

function mainGridTabId(tabId: TabsType) {
  return `main-grid-tab-${tabId}`;
}

function mainGridTabLabelId(tabId: TabsType) {
  return `${mainGridTabId(tabId)}-label`;
}

function formDataFromSubmit(event: SubmitEvent<HTMLFormElement>): FormData {
  const submitter = event.nativeEvent.submitter;
  return new FormData(
    event.currentTarget,
    submitter instanceof HTMLButtonElement ? submitter : undefined,
  );
}

function tabFromSubmit(event: SubmitEvent<HTMLFormElement>): TabsType | null {
  const parsed = tabsTypeSchema.safeParse(formDataFromSubmit(event).get("tab"));
  return parsed.success ? parsed.data : null;
}

export default function NavItemsClient({
  initialState,
}: {
  initialState: MainGridTabFormState;
}) {
  const [state, formAction, isPending] = useActionState(
    switchMainGridTabFormAction,
    initialState,
  );
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (_current, next: MainGridTabFormState) => next,
  );
  const skipSubmitForTab = useRef<TabsType | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const indicatorTransition = reduceMotion ? { duration: 0 } : UI_SPRING;

  function commitTab(tab: TabsType) {
    if (tab === optimisticState.activeTab) {
      return;
    }

    const formData = new FormData();
    formData.set("tab", tab);
    const next: MainGridTabFormState = { activeTab: tab };

    capture("grid_tab_switched", { tab });

    startTransition(() => {
      setOptimisticState(next);
      formAction(formData);
    });
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const tab = tabFromSubmit(event);
    if (!tab || tab === optimisticState.activeTab) {
      return;
    }

    if (skipSubmitForTab.current === tab) {
      skipSubmitForTab.current = null;
      return;
    }

    commitTab(tab);
  }

  function handleValueChange(value: TabsType) {
    const parsed = tabsTypeSchema.safeParse(value);
    if (!parsed.success || parsed.data === optimisticState.activeTab) {
      return;
    }

    skipSubmitForTab.current = parsed.data;
    commitTab(parsed.data);
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      aria-label="Switch main grid view"
      aria-busy={isPending || undefined}
      data-pending={isPending || undefined}
    >
      <Tabs
        value={optimisticState.activeTab}
        onValueChange={handleValueChange}
        className="flex flex-col items-center"
      >
        <TabsList
          aria-label="Main grid views"
          activateOnFocus
          className="h-11 w-fit gap-1 rounded-full bg-card px-px py-0 text-secondary-foreground ring-2 ring-border"
        >
          <LayoutGroup id="nav-tabs">
            {tabs.map((tabId) => (
              <TabsTrigger
                key={tabId}
                id={mainGridTabId(tabId)}
                value={tabId}
                aria-controls={MAIN_GRID_TABPANEL_ID}
                render={
                  <button
                    type="submit"
                    name="tab"
                    value={tabId}
                    aria-labelledby={mainGridTabLabelId(tabId)}
                  />
                }
                className={cn(
                  "relative z-0 rounded-full px-4 text-xl data-active:bg-transparent data-active:text-background data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent",
                )}
              >
                {optimisticState.activeTab === tabId ? (
                  <motion.span
                    layoutId="nav-tab-indicator"
                    className="pointer-events-none absolute inset-0 z-0 rounded-full bg-foreground"
                    transition={indicatorTransition}
                    aria-hidden="true"
                  />
                ) : null}
                <span id={mainGridTabLabelId(tabId)} className="relative z-10">
                  {tabId}
                </span>
              </TabsTrigger>
            ))}
          </LayoutGroup>
        </TabsList>
      </Tabs>
    </form>
  );
}
