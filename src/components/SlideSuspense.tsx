import { Suspense, ViewTransition, type ReactNode } from "react";

/**
 * Shared Suspense + View Transition enter/exit shell used across route
 * and feature loading boundaries.
 */
export function SlideSuspense({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <ViewTransition exit="slide-down">{fallback}</ViewTransition>
      }
    >
      <ViewTransition enter="slide-up" default="none">
        {children}
      </ViewTransition>
    </Suspense>
  );
}
