'use client';

import * as React from 'react';

import { Drawer as DrawerPrimitive } from 'vaul';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../lib/z-layers';

/*
 * Vendored from shadcn's `new-york-v4` drawer registry entry (built on `vaul`,
 * same as upstream).
 *
 * Local patches — re-apply these after any `shadcn add drawer`:
 * 1. Imports: `cn` from `@repo/ui/utils` (upstream uses its `cn` alias). The
 *    `vaul` import is upstream-verbatim.
 * 2. `OVERLAY_LAYER` (src/lib/z-layers.ts) replaces upstream's `z-50` on
 *    `DrawerOverlay` and `DrawerContent`. Why: this package is published and
 *    can't assume it owns the app's z-index scale — see #359.
 * 3. `Drawer` root takes a `draggable` prop (`CustomProps`) → `handleOnly={!
 *    draggable}`, plus `container` defaulted to `useConfig().getContainer()`.
 *    Why: the container keeps portalled content inside the themed wrapper, or
 *    dark mode and the CSS custom properties don't reach it.
 * 4. `DrawerContent` takes `CustomContentProps` (`classNames`, `handlebar`,
 *    `mask`): `classNames.mask` + `!mask && 'hidden'` on the overlay, and the
 *    drag handlebar is gated by `handlebar` with `classNames.handlebar`.
 *
 * The rest of what `shadcn add drawer --diff` reports is Tailwind class
 * ordering and prettier line-wrapping from this repo's formatter, not a patch.
 */
interface CustomProps {
  draggable?: boolean;
}

function Drawer({
  draggable,
  container,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root> & CustomProps) {
  const { getContainer } = useConfig();

  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      handleOnly={!draggable}
      container={container ?? getContainer()}
      {...props}
    />
  );
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        `data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0
        bg-black/50`,
        OVERLAY_LAYER,
        className,
      )}
      {...props}
    />
  );
}

interface CustomContentProps {
  classNames?: Record<string, string>;
  handlebar?: boolean;
  mask?: boolean;
}

function DrawerContent({
  className,
  children,
  classNames = {},
  handlebar,
  mask,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & CustomContentProps) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay
        className={cn(
          classNames?.mask || '',
          !mask && 'hidden',
          //
        )}
      />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'group/drawer-content bg-background fixed flex h-auto flex-col',
          OVERLAY_LAYER,
          `data-[vaul-drawer-direction=top]:inset-x-0
          data-[vaul-drawer-direction=top]:top-0
          data-[vaul-drawer-direction=top]:mb-24
          data-[vaul-drawer-direction=top]:max-h-[80vh]
          data-[vaul-drawer-direction=top]:rounded-b-lg
          data-[vaul-drawer-direction=top]:border-b`,
          `data-[vaul-drawer-direction=bottom]:inset-x-0
          data-[vaul-drawer-direction=bottom]:bottom-0
          data-[vaul-drawer-direction=bottom]:mt-24
          data-[vaul-drawer-direction=bottom]:max-h-[80vh]
          data-[vaul-drawer-direction=bottom]:rounded-t-lg
          data-[vaul-drawer-direction=bottom]:border-t`,
          `data-[vaul-drawer-direction=right]:inset-y-0
          data-[vaul-drawer-direction=right]:right-0
          data-[vaul-drawer-direction=right]:w-3/4
          data-[vaul-drawer-direction=right]:border-l
          data-[vaul-drawer-direction=right]:sm:max-w-sm`,
          `data-[vaul-drawer-direction=left]:inset-y-0
          data-[vaul-drawer-direction=left]:left-0
          data-[vaul-drawer-direction=left]:w-3/4
          data-[vaul-drawer-direction=left]:border-r
          data-[vaul-drawer-direction=left]:sm:max-w-sm`,
          className,
        )}
        {...props}
      >
        {handlebar && (
          <div
            className={cn(
              `bg-muted mx-auto mt-4 hidden h-2 w-25 shrink-0 rounded-full
              group-data-[vaul-drawer-direction=bottom]/drawer-content:block`,
              classNames?.handlebar,
            )}
          />
        )}
        {/* <div
          className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full
            group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
        /> */}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        `flex flex-col gap-0.5 p-4
        group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center
        group-data-[vaul-drawer-direction=top]/drawer-content:text-center
        md:gap-1.5 md:text-left`,
        className,
      )}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
