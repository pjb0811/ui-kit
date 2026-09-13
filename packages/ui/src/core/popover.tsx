'use client';

import * as React from 'react';

import { Popover as PopoverPrimitive } from '@base-ui/react/popover';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../lib/z-layers';

// Base UI primitives with repo-owned styling; no longer vendored from shadcn.
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

function PopoverContent({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  container,
  ...props
}: Omit<React.ComponentProps<typeof PopoverPrimitive.Popup>, 'className'> & {
  className?: string;
  align?: PopoverPrimitive.Positioner.Props['align'];
  side?: PopoverPrimitive.Positioner.Props['side'];
  sideOffset?: number;
  container?: HTMLElement;
}) {
  const { getContainer } = useConfig();

  return (
    <PopoverPrimitive.Portal container={container ?? getContainer()}>
      <PopoverPrimitive.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        arrowPadding={16}
        className={OVERLAY_LAYER}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            `bg-popover text-popover-foreground w-72 origin-(--transform-origin)
            rounded-md border p-4 shadow-md outline-hidden
            transition-[opacity,transform] duration-150
            data-ending-style:scale-95 data-ending-style:opacity-0
            data-starting-style:scale-95 data-starting-style:opacity-0`,
            className,
            //
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverArrow() {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className="data-[side=bottom]:-top-2 data-[side=left]:-right-[13px]
        data-[side=left]:rotate-90 data-[side=right]:-left-[13px]
        data-[side=right]:-rotate-90 data-[side=top]:-bottom-2
        data-[side=top]:rotate-180"
    >
      <svg width="18" height="9" viewBox="0 0 18 9" fill="none">
        <path d="M0 9 9 0 18 9" className="fill-border" />
        <path d="M1 9 9 1 17 9" className="fill-popover" />
      </svg>
    </PopoverPrimitive.Arrow>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn('flex flex-col gap-1 text-sm', className)}
      {...props}
    />
  );
}

function PopoverTitle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof PopoverPrimitive.Title>, 'className'> & {
  className?: string;
}) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn('font-medium', className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
};
