"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { createContext, use } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

type PillTabsSize = "default" | "compact";

type PillTabsContextValue = {
  layoutGroupId: string;
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

const pillTabsListVariants = cva(
  "rounded-full bg-card px-px py-0 text-secondary-foreground ring-2 ring-border",
  {
    variants: {
      size: {
        default: "h-11 w-fit gap-1",
        compact: "h-9 w-full gap-px xl:h-11 xl:w-fit xl:gap-1",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const pillTabsItemVariants = cva(
  "relative z-0 rounded-full data-active:bg-transparent data-active:text-background data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-transparent",
  {
    variants: {
      size: {
        default: "px-4 text-xl",
        compact:
          "p-0 xl:px-3 xl:text-xl [&_svg:not([class*='size-'])]:size-4 xl:[&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type PillTabsRootProps = TabsPrimitive.Root.Props & {
  layoutGroupId: string;
};

function PillTabsRoot({
  layoutGroupId,
  value,
  children,
  className,
  ...props
}: PillTabsRootProps) {
  return (
    <PillTabsContext value={{ layoutGroupId, activeValue: value }}>
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

function PillTabsList({
  size = "default",
  className,
  children,
  ...props
}: PillTabsListProps) {
  const { layoutGroupId } = usePillTabsContext();

  return (
    <PillTabsSizeContext value={size ?? "default"}>
      <TabsList
        className={cn(pillTabsListVariants({ size }), className)}
        {...props}
      >
        <LayoutGroup id={layoutGroupId}>{children}</LayoutGroup>
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
  const { layoutGroupId, activeValue } = usePillTabsContext();
  const size = use(PillTabsSizeContext);
  const reduceMotion = useReducedMotion() ?? false;
  const indicatorTransition = reduceMotion ? { duration: 0 } : UI_SPRING;
  const isActive = value === activeValue;

  return (
    <TabsTrigger
      value={value}
      className={cn(pillTabsItemVariants({ size }), className)}
      {...props}
    >
      {isActive ? (
        <motion.span
          layoutId={`${layoutGroupId}-indicator`}
          className="pointer-events-none absolute inset-0 z-0 rounded-full bg-foreground"
          transition={indicatorTransition}
          aria-hidden="true"
        />
      ) : null}
      <span className="relative z-10">{children}</span>
    </TabsTrigger>
  );
}

export const PillTabs = {
  Root: PillTabsRoot,
  List: PillTabsList,
  Item: PillTabsItem,
};
