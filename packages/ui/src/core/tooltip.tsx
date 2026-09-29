'use client';

import * as React from 'react';

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../lib/z-layers';

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

type TooltipContentProps = React.ComponentProps<
  typeof TooltipPrimitive.Popup
> & {
  side?: TooltipPrimitive.Positioner.Props['side'];
  align?: TooltipPrimitive.Positioner.Props['align'];
  sideOffset?: number;
  container?: HTMLElement;
};

function TooltipContent({
  className,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  container,
  ...props
}: TooltipContentProps) {
  const { getContainer } = useConfig();

  return (
    <TooltipPrimitive.Portal container={container ?? getContainer()}>
      <TooltipPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={OVERLAY_LAYER}
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            `bg-popover text-popover-foreground max-w-xs
            origin-(--transform-origin) rounded-md border px-2 py-1 text-xs
            shadow-md transition-[opacity,transform] duration-150
            data-ending-style:scale-95 data-ending-style:opacity-0
            data-starting-style:scale-95 data-starting-style:opacity-0`,
            className,
            //
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipTrigger };
