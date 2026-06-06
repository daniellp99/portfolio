"use client";

import { createContext, use, useState, type ReactNode } from "react";

const SkillHoverTitleContext = createContext<string | null>(null);
const SkillHoverSetterContext = createContext<
  ((title: string | null) => void) | null
>(null);

export function SkillHoverProvider({ children }: { children: ReactNode }) {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  return (
    <SkillHoverSetterContext value={setHoveredTitle}>
      <SkillHoverTitleContext value={hoveredTitle}>
        {children}
      </SkillHoverTitleContext>
    </SkillHoverSetterContext>
  );
}

export function useSkillHoverTitle(): string | null {
  return use(SkillHoverTitleContext);
}

export function useSkillHoverSetter(): (title: string | null) => void {
  const setHoveredTitle = use(SkillHoverSetterContext);
  if (!setHoveredTitle) {
    throw new Error(
      "useSkillHoverSetter must be used within SkillHoverProvider",
    );
  }
  return setHoveredTitle;
}
