"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  );
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50 h-(--positioner-height,max-content) w-(--positioner-width,max-content) min-w-0 transition-[left,right,top,bottom] [transition-duration:var(--default-transition-duration)] [transition-timing-function:var(--default-transition-timing-function)] data-instant:transition-none"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 flex min-h-0 w-full max-w-xs min-w-0 flex-col items-center gap-0 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5",
            "origin-(--transform-origin) transition-[opacity,transform,width,height] [transition-duration:var(--default-transition-duration)] [transition-timing-function:var(--default-transition-timing-function)] data-instant:transition-none",
            "data-starting-style:scale-95 data-starting-style:opacity-0",
            "data-ending-style:scale-95 data-ending-style:opacity-0",
            "**:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
            className,
          )}
          {...props}
        >
          <TooltipPrimitive.Viewport
            data-slot="tooltip-viewport"
            className={cn(
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
            )}
          >
            {children}
          </TooltipPrimitive.Viewport>
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
