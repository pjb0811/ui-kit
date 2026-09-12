'use client';

import * as React from 'react';

import * as PopoverPrimitive from '@radix-ui/react-popover';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../lib/z-layers';

/*
 * Vendored from shadcn's `new-york-v4` popover registry entry.
 *
 * Local patches — re-apply these after any `shadcn add popover`:
 * 1. Imports: `PopoverPrimitive` from `@radix-ui/react-popover` (upstream uses
 *    the unified `radix-ui` package, which this repo doesn't install), `cn`
 *    from `@repo/ui/utils`.
 * 2. `OVERLAY_LAYER` (src/lib/z-layers.ts) replaces upstream's `z-50` on
 *    `PopoverContent`. Why: this package is published and can't assume it owns
 *    the app's z-index scale — see #359.
 * 3. `PopoverContent` takes a `container` prop, defaulted to
 *    `useConfig().getContainer()`, and passes it to `PopoverPrimitive.Portal`
 *    (upstream renders the portal with no `container`). Why: portalled content
 *    must stay inside the themed wrapper, or dark mode and the CSS custom
 *    properties don't reach it.
 *
 * The rest of what `shadcn add popover --diff` reports is Tailwind class
 * ordering and prettier line-wrapping from this repo's formatter, not a patch.
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  container,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  container?: HTMLElement;
}) {
  const { getContainer } = useConfig();

  return (
    <PopoverPrimitive.Portal container={container ?? getContainer()}>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          `bg-popover text-popover-foreground data-[state=open]:animate-in
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95
          data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
          data-[side=left]:slide-in-from-right-2
          data-[side=right]:slide-in-from-left-2
          data-[side=top]:slide-in-from-bottom-2 w-72
          origin-(--radix-popover-content-transform-origin) rounded-md border
          p-4 shadow-md outline-hidden`,
          OVERLAY_LAYER,
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
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

function PopoverTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <div
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
    <p
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
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
};
