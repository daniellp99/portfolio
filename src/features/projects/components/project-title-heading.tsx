"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ProjectTitleHeading({
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
      data-testid="project-title"
      className={className}
    >
      {children}
    </h1>
  );
}
