"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SkillHoverValue = {
  hoveredTitle: string | null;
  setHoveredTitle: (title: string | null) => void;
};

const SkillHoverContext = createContext<SkillHoverValue | null>(null);

export function SkillHoverProvider({ children }: { children: ReactNode }) {
  const [hoveredTitle, setHoveredTitleState] = useState<string | null>(null);

  const setHoveredTitle = useCallback((title: string | null) => {
    setHoveredTitleState(title);
  }, []);

  const value = useMemo(
    () => ({ hoveredTitle, setHoveredTitle }),
    [hoveredTitle, setHoveredTitle],
  );

  return (
    <SkillHoverContext.Provider value={value}>
      {children}
    </SkillHoverContext.Provider>
  );
}

export function useSkillHover(): SkillHoverValue {
  const ctx = use(SkillHoverContext);
  if (!ctx) {
    throw new Error("useSkillHover must be used within SkillHoverProvider");
  }
  return ctx;
}
