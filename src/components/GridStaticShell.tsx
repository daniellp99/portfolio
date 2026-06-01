"use client";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { ResponsiveLayouts } from "react-grid-layout";

import {
  buildStaticShellCss,
  staticShellContainerClassName,
  staticShellItemProps,
} from "@/lib/site/grid/static-shell";

export default function GridStaticShell({
  layouts,
  children,
}: {
  layouts: ResponsiveLayouts;
  children: ReactNode;
}) {
  const css = buildStaticShellCss(layouts);

  return (
    <div className={staticShellContainerClassName()}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div data-grid-shell>
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          const itemId = String((child as ReactElement).key ?? "");
          if (!itemId) return child;
          return (
            <div key={itemId} {...staticShellItemProps(itemId)}>
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}
