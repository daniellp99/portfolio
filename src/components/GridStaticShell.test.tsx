import { describe, expect, test } from "bun:test";
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import GridStaticShell from "./GridStaticShell";
import { generateLayouts } from "@/lib/site/grid";

describe("GridStaticShell", () => {
  test("wraps keyed grid children in static placement elements", () => {
    const element = GridStaticShell({
      layouts: generateLayouts("All", []),
      children: <section key="me">About content</section>,
    });

    expect(isValidElement(element)).toBe(true);
    const [, shell] = Children.toArray(
      (element as ReactElement<{ children: ReactNode }>).props.children,
    );

    expect(isValidElement(shell)).toBe(true);
    expect(
      (shell as ReactElement<{ "data-grid-shell"?: boolean }>).props[
        "data-grid-shell"
      ],
    ).toBe(true);

    const [wrappedChild] = Children.toArray(
      (shell as ReactElement<{ children: ReactNode }>).props.children,
    );

    expect(isValidElement(wrappedChild)).toBe(true);
    expect(
      (wrappedChild as ReactElement<{ "data-grid-item"?: string }>).props[
        "data-grid-item"
      ],
    ).toBe("me");
    expect(
      (
        (wrappedChild as ReactElement<{ children: ReactElement }>).props
          .children as ReactElement<{ children: string }>
      ).props.children,
    ).toBe("About content");
  });
});
