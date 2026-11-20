"use client";

import {
  Popover as PopoverPrimitive,
  PopoverContent as PopoverContentPrimitive,
  PopoverDescription as PopoverDescriptionPrimitive,
  PopoverTitle as PopoverTitlePrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
  type PopoverContentProps,
  type PopoverContentState,
} from "@ui-sdk/react/popover";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const popoverContentVariants = cva(
  [
    "z-50 flex min-h-0 min-w-0 flex-col outline-hidden",
    "origin-(--transform-origin) transition-[opacity,transform,width,height] [transition-duration:var(--default-transition-duration)] [transition-timing-function:var(--default-transition-timing-function)]",
    "data-starting-style:scale-95 data-starting-style:opacity-0",
    "data-ending-style:scale-95 data-ending-style:opacity-0",
    "**:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
  ],
  {
    variants: {
      variant: {
        default:
          "w-72 max-w-[min(100vw-2rem,var(--anchor-width))] gap-4 rounded-md bg-popover p-4 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10",
        tooltip: [
          "relative w-fit max-w-xs gap-0 rounded-md border-0 bg-foreground px-3 py-1.5 text-xs text-background shadow-md ring-0 duration-100",
          "before:pointer-events-none before:absolute before:z-50 before:size-2.5 before:translate-y-[calc(-50%-2px)] before:rotate-45 before:rounded-[2px] before:bg-foreground before:content-['']",
          "data-[side=bottom]:before:top-1 data-[side=bottom]:before:left-1/2 data-[side=bottom]:before:-translate-x-1/2",
          "data-[side=top]:before:-bottom-2.5 data-[side=top]:before:left-1/2 data-[side=top]:before:-translate-x-1/2",
          "data-[side=left]:before:top-1/2! data-[side=left]:before:-right-1 data-[side=left]:before:-translate-y-1/2",
          "data-[side=right]:before:top-1/2! data-[side=right]:before:-left-1 data-[side=right]:before:-translate-y-1/2",
          "data-[side=inline-end]:before:top-1/2! data-[side=inline-end]:before:-left-1 data-[side=inline-end]:before:-translate-y-1/2",
          "data-[side=inline-start]:before:top-1/2! data-[side=inline-start]:before:-right-1 data-[side=inline-start]:before:-translate-y-1/2",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Popover(props: ComponentProps<typeof PopoverPrimitive>) {
  return <PopoverPrimitive data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: ComponentProps<typeof PopoverTriggerPrimitive>) {
  return <PopoverTriggerPrimitive data-slot="popover-trigger" {...props} />;
}

type PortfolioPopoverContentProps<Payload = unknown> = Omit<
  ComponentProps<typeof PopoverContentPrimitive>,
  "children"
> &
  PopoverContentProps &
  VariantProps<typeof popoverContentVariants> & {
    children?:
      | ReactNode
      | ((state: PopoverContentState<Payload>) => ReactNode);
  };

function PopoverContent<Payload = unknown>({
  className,
  variant = "default",
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PortfolioPopoverContentProps<Payload>) {
  return (
    <PopoverContentPrimitive<Payload>
      data-slot="popover-content"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className={cn(popoverContentVariants({ variant }), className)}
      {...props}
    />
  );
}

function PopoverHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  );
}

function PopoverTitle({
  className,
  ...props
}: ComponentProps<typeof PopoverTitlePrimitive>) {
  return (
    <PopoverTitlePrimitive
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: ComponentProps<typeof PopoverDescriptionPrimitive>) {
  return (
    <PopoverDescriptionPrimitive
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverContent,
  popoverContentVariants,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
