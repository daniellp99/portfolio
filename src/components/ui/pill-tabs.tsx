"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  use,
  useLayoutEffect,
  useRef,
  type CSSProperties,
} from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type PillTabsSize = "default" | "compact";

type PillTabsContextValue = {
  activeValue: string | undefined;
};

const PillTabsContext = createContext<PillTabsContextValue | null>(null);
const PillTabsSizeContext = createContext<PillTabsSize>("default");

function usePillTabsContext() {
  const context = use(PillTabsContext);
  if (!context) {
    throw new Error("PillTabs components must be used within PillTabs.Root");
  }
  return context;
}

/** Matches production / pre-refactor pill chrome (h-11, px-px py-0, gap-1). */
const pillTabsListVariants = cva(
  // Override TabsList default padding/height; stretch so full-height items
  // keep the sliding indicator vertically centered.
  "relative items-stretch rounded-4xl bg-card px-px py-0 text-secondary-foreground ring-2 ring-border",
  {
    variants: {
      size: {
        default: "h-11 w-fit gap-1",
        compact: "h-10 w-fit gap-px",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const pillTabsItemVariants = cva(
  // `h-full` + `py-0` override TabsTrigger's `h-[calc(100%-1px)]` / `py-1`,
  // which otherwise leave the sliding indicator optically low in the list.
  "relative z-0 h-full rounded-4xl py-0 data-active:bg-transparent data-active:text-background data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent",
  {
    variants: {
      size: {
        default: "px-4 text-xl",
        compact:
          "aspect-square flex-none px-0 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type PillTabsRootProps = TabsPrimitive.Root.Props;

function PillTabsRoot({
  value,
  children,
  className,
  ...props
}: PillTabsRootProps) {
  return (
    <PillTabsContext value={{ activeValue: value }}>
      <Tabs
        value={value}
        className={cn("flex flex-col items-center", className)}
        {...props}
      >
        {children}
      </Tabs>
    </PillTabsContext>
  );
}

type PillTabsListProps = TabsPrimitive.List.Props &
  VariantProps<typeof pillTabsListVariants>;

function syncIndicator(
  list: HTMLElement,
  indicator: HTMLElement,
  activeValue: string | undefined,
) {
  if (activeValue === undefined) {
    indicator.hidden = true;
    return;
  }
  const active = list.querySelector<HTMLElement>(
    `[data-value="${CSS.escape(String(activeValue))}"]`,
  );
  if (!active) {
    indicator.hidden = true;
    return;
  }

  // Match former motion `inset-0` on the trigger: padding box, not border box.
  indicator.hidden = false;
  indicator.style.transform = `translate(${active.offsetLeft + active.clientLeft}px, ${active.offsetTop + active.clientTop}px)`;
  indicator.style.width = `${active.clientWidth}px`;
  indicator.style.height = `${active.clientHeight}px`;
}

function PillTabsList({
  size = "default",
  className,
  children,
  ...props
}: PillTabsListProps) {
  const { activeValue } = usePillTabsContext();
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const update = () => syncIndicator(list, indicator, activeValue);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(list);
    const valueNodes = list.querySelectorAll("[data-value]");
    for (let i = 0; i < valueNodes.length; i++) {
      observer.observe(valueNodes[i]!);
    }
    return () => observer.disconnect();
  }, [activeValue, children, size]);

  const indicatorStyle: CSSProperties = {
    transitionProperty: "transform, width, height",
    transitionDuration: "var(--duration-spring)",
    transitionTimingFunction: "var(--ease-spring)",
  };

  return (
    <PillTabsSizeContext value={size ?? "default"}>
      <TabsList
        ref={listRef}
        className={cn(pillTabsListVariants({ size }), className)}
        {...props}
      >
        <span
          ref={indicatorRef}
          aria-hidden="true"
          hidden
          className="pointer-events-none absolute top-0 left-0 z-0 rounded-4xl bg-foreground motion-reduce:transition-none!"
          style={indicatorStyle}
        />
        {children}
      </TabsList>
    </PillTabsSizeContext>
  );
}

type PillTabsItemProps = TabsPrimitive.Tab.Props;

function PillTabsItem({
  className,
  value,
  children,
  ...props
}: PillTabsItemProps) {
  const size = use(PillTabsSizeContext);

  return (
    <TabsTrigger
      value={value}
      data-value={value}
      className={cn(pillTabsItemVariants({ size }), className)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </TabsTrigger>
  );
}

export const PillTabs = {
  Root: PillTabsRoot,
  List: PillTabsList,
  Item: PillTabsItem,
};
