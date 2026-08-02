"use client";

import {
  startTransition,
  useActionState,
  useOptimistic,
  useRef,
  type SubmitEvent,
} from "react";

import { Field, FieldError } from "@/components/ui/field";
import { PillTabs } from "@/components/ui/pill-tabs";

import {
  switchMainGridTabFormAction,
  type MainGridTabFormState,
} from "@/features/home/home-actions";
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
    const next: MainGridTabFormState = { status: "ok", activeTab: tab };

    capture("grid_tab_switched", { tab });

    startTransition(() => {
      setOptimisticState(next);
      formAction(formData);
    });
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const tab = tabFromSubmit(event);
    if (!tab) {
      startTransition(() => {
        formAction(formDataFromSubmit(event));
      });
      return;
    }
    if (tab === optimisticState.activeTab) {
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
    if (!parsed.success) {
      const formData = new FormData();
      formData.set("tab", value);
      startTransition(() => {
        formAction(formData);
      });
      return;
    }
    if (parsed.data === optimisticState.activeTab) {
      return;
    }

    skipSubmitForTab.current = parsed.data;
    commitTab(parsed.data);
  }

  const error =
    optimisticState.status === "error" ? optimisticState.error : null;

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      aria-label="Switch main grid view"
      aria-busy={isPending || undefined}
      data-pending={isPending || undefined}
    >
      <Field data-invalid={error ? true : undefined} className="contents">
        <PillTabs.Root
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
        <FieldError className="sr-only">{error}</FieldError>
      </Field>
    </form>
  );
}
