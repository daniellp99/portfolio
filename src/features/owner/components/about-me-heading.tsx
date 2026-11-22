"use client";

import type { ReactNode } from "react";

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
