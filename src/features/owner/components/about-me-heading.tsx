"use client";

import { useEffect, useRef, type ReactNode } from "react";

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
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const focusTitle = () => {
      el.focus({ preventScroll: true });
    };

    const active = document.activeViewTransition;
    if (active?.finished) {
      void active.finished.finally(focusTitle);
      return;
    }

    focusTitle();
  }, []);

  return (
    <h1
      ref={ref}
      tabIndex={-1}
      data-testid="home-title"
      className={className}
    >
      {children}
    </h1>
  );
}
