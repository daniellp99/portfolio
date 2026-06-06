"use client";

import {
  startTransition,
  useActionState,
  useOptimistic,
  useRef,
  type SubmitEvent,
} from "react";

import { PillTabs } from "@/components/ui/pill-tabs";

import {
  switchMainGridTabFormAction,
  type MainGridTabFormState,
} from "@/lib/actions/switch-main-grid-tab-form";
import { capture } from "@/lib/analytics";
import { MAIN_GRID_TABPANEL_ID } from "@/lib/site/constants";
import { tabs, tabsTypeSchema, type TabsType } from "@/lib/site/tabs";

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

  function handleValueChange(value: string) {
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
      <PillTabs.Root
        layoutGroupId="nav-tabs"
        value={optimisticState.activeTab}
        onValueChange={handleValueChange}
      >
        <PillTabs.List
          size="default"
          aria-label="Main grid views"
          activateOnFocus
        >
          {tabs.map((tabId) => (
            <PillTabs.Item
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
            >
              <span id={mainGridTabLabelId(tabId)}>{tabId}</span>
            </PillTabs.Item>
          ))}
        </PillTabs.List>
      </PillTabs.Root>
    </form>
  );
}
