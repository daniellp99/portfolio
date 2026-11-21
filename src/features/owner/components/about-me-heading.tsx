"use client";

import type { ReactNode } from "react";

/**
 * React 19 callback ref: focus when the heading mounts, after any in-flight
 * ViewTransition finishes. Cleanup cancels a late focus if the node unmounts.
 * (Callback refs replace mount useEffect for DOM-node side effects.)
 */
function focusHeadingAfterViewTransition(
  el: HTMLHeadingElement | null,
): void | (() => void) {
  if (!el) return;

  let cancelled = false;
  const focusTitle = () => {
    if (!cancelled) {
      el.focus({ preventScroll: true });
    }
  };

  const active = document.activeViewTransition;
  if (active?.finished) {
    void active.finished.finally(focusTitle);
  } else {
    focusTitle();
  }

  return () => {
    cancelled = true;
  };
}

/**
 * Home about title with post-navigation focus routing.
 * same-document-transitions: after ViewTransition (e.g. project → home),
 * move focus to the list/home heading so keyboard/AT users get context
 * (tabindex=-1 + focus). Mirrors ProjectTitleHeading on the detail route.
 */
export function AboutMeHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      ref={focusHeadingAfterViewTransition}
      tabIndex={-1}
      data-testid="home-title"
      className={className}
    >
      {children}
    </h1>
  );
}
