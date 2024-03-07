"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Layouts } from "react-grid-layout";

interface ContextProps {
  layouts: Layouts;
  setLayouts: Dispatch<SetStateAction<Layouts>>;
}

const LayoutsContext = createContext<ContextProps>({
  layouts: { lg: [], md: [], sm: [], xs: [] },
  setLayouts: (): Layouts => ({
    lg: [],
    md: [],
    sm: [],
    xs: [],
  }),
});

function LayoutsContextProvider({
  children,
  defaultLayouts,
}: {
  children: ReactNode;
  defaultLayouts: Layouts;
}) {
  const [layouts, setLayouts] = useState(defaultLayouts);

  return (
    <LayoutsContext.Provider value={{ layouts, setLayouts }}>
      {children}
    </LayoutsContext.Provider>
  );
}

const useLayoutsContext: () => ContextProps = () => useContext(LayoutsContext);

export { LayoutsContextProvider, useLayoutsContext };
