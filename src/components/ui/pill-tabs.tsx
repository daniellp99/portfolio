"use client";

import { TabsIndicator } from "@ui-sdk/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  use,
  type ComponentProps,
  type ReactNode,
} from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type PillTabsSize = "default" | "compact";

const PillTabsSizeContext = createContext<PillTabsSize>("default");

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
  "relative z-0 h-full rounded-4xl py-0 data-selected:bg-transparent data-selected:text-background data-selected:shadow-none dark:data-selected:border-transparent dark:data-selected:bg-transparent",
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

type PillTabsRootProps = ComponentProps<typeof Tabs>;

function PillTabsRoot({ children, className, ...props }: PillTabsRootProps) {
  return (
    <Tabs className={cn("flex flex-col items-center", className)} {...props}>
      {children}
    </Tabs>
  );
}

type PillTabsListProps = Omit<ComponentProps<typeof TabsList>, "children"> &
  VariantProps<typeof pillTabsListVariants> & {
    children?: ReactNode;
  };

function PillTabsList({
  size = "default",
  className,
  children,
  ...props
}: PillTabsListProps) {
  return (
    <PillTabsSizeContext value={size ?? "default"}>
      <TabsList
        className={cn(pillTabsListVariants({ size }), className)}
        {...props}
      >
        <TabsIndicator
          aria-hidden="true"
          className="pointer-events-none absolute z-0 rounded-4xl bg-foreground transition-[top,left,width,height] [transition-duration:var(--duration-spring)] [transition-timing-function:var(--ease-spring)] motion-reduce:transition-none! data-[activation-direction=none]:transition-none top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width)"
        />
        {children}
      </TabsList>
    </PillTabsSizeContext>
  );
}

type PillTabsItemProps = Omit<ComponentProps<typeof TabsTrigger>, "children"> & {
  children?: ReactNode;
};

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
