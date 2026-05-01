"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

const popoverViewportClassName = cn(
  "relative isolate w-full min-w-0 overflow-hidden",
  "**:data-previous:pointer-events-none **:data-previous:absolute **:data-previous:inset-0 **:data-previous:z-10 **:data-previous:fill-mode-forwards",
  "**:data-previous:animate-out **:data-previous:fade-out-0",
  "**:data-current:relative **:data-current:z-20",
  "[&:has([data-previous])_[data-current]]:animate-in [&:has([data-previous])_[data-current]]:fade-in-0",
  "[&[data-activation-direction*='left']_[data-current]]:slide-in-from-left-1",
  "[&[data-activation-direction*='left']_[data-previous]]:slide-out-to-right-1",
  "[&[data-activation-direction*='right']_[data-current]]:slide-in-from-right-1",
  "[&[data-activation-direction*='right']_[data-previous]]:slide-out-to-left-1",
  "[&[data-activation-direction*='up']_[data-current]]:slide-in-from-top-1",
  "[&[data-activation-direction*='up']_[data-previous]]:slide-out-to-bottom-1",
  "[&[data-activation-direction*='down']_[data-current]]:slide-in-from-bottom-1",
  "[&[data-activation-direction*='down']_[data-previous]]:slide-out-to-top-1",
);

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  children,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50 h-(--positioner-height,max-content) w-(--positioner-width,max-content) min-w-0 transition-[left,right,top,bottom] [transition-duration:var(--default-transition-duration)] [transition-timing-function:var(--default-transition-timing-function)] data-instant:transition-none"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex min-h-0 w-72 max-w-[min(100vw-2rem,var(--positioner-width))] min-w-0 flex-col gap-4 rounded-md bg-popover p-4 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden",
            "origin-(--transform-origin) transition-[opacity,transform,width,height] [transition-duration:var(--default-transition-duration)] [transition-timing-function:var(--default-transition-timing-function)] data-instant:transition-none",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
            "**:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
            className,
          )}
          {...props}
        >
          <PopoverPrimitive.Viewport
            data-slot="popover-viewport"
            className={popoverViewportClassName}
          >
            {children}
          </PopoverPrimitive.Viewport>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
