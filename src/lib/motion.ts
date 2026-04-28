/**
 * Shared motion primitives to keep animation feel consistent.
 * Uses the same spring values across interactive UI elements.
 */

export const UI_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.85,
};
