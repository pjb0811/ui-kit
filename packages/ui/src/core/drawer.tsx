'use client';

import * as React from 'react';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../lib/z-layers';

/*
 * Drawer rebuilt on Base UI's Dialog primitives (ui-kit#375, Decision #2) —
 * no longer `vaul`. Base UI has no dedicated Drawer, so the side-sheet is a
 * Dialog whose popup is anchored to an edge and slides in/out.
 *
 * Consequences of dropping vaul:
 * - No drag-to-dismiss / snap points. The `handlebar` stays as a visual
 *   affordance on bottom drawers but is no longer draggable.
 * - `direction` is a local `DrawerContent` prop (top/bottom/left/right) exposed
 *   as `data-direction`, which drives both the popup's own placement/slide and
 *   the `group-data-[direction=…]` hooks the header/handlebar rely on. It
 *   replaces vaul's `data-vaul-drawer-direction`.
 * - Pointer-outside dismissal (`maskClosable`) is a root concern
 *   (`disablePointerDismissal`), and mask/modal behaviour is driven by the
 *   consumer — see `organisms/drawer`.
 *
 * Retained local patches: `OVERLAY_LAYER` (#359) over upstream's z-index, the
 * themed portal `container` (default `useConfig().getContainer()`), and the
 * `classNames`/`handlebar`/`mask` custom props.
 */
type Direction = 'top' | 'bottom' | 'left' | 'right';

function Drawer({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        `fixed inset-0 bg-black/50 transition-opacity duration-300
        data-ending-style:opacity-0 data-starting-style:opacity-0`,
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
  direction?: Direction;
  container?: HTMLElement;
}

function DrawerContent({
  className,
  children,
  classNames = {},
  handlebar,
  mask = true,
  direction = 'bottom',
  container,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & CustomContentProps) {
  const { getContainer } = useConfig();
  const resolvedContainer = container ?? getContainer();

  return (
    <DrawerPortal container={resolvedContainer}>
      {mask && <DrawerOverlay className={cn(classNames?.mask)} />}
      <DialogPrimitive.Popup
        data-slot="drawer-content"
        data-direction={direction}
        className={cn(
          `group/drawer-content bg-background fixed flex h-auto flex-col
          transition-transform duration-300 ease-in-out`,
          OVERLAY_LAYER,
          `data-[direction=top]:inset-x-0 data-[direction=top]:top-0
          data-[direction=top]:mb-24 data-[direction=top]:max-h-[80vh]
          data-[direction=top]:w-full data-[direction=top]:rounded-b-lg
          data-[direction=top]:border-b
          data-[direction=top]:data-ending-style:-translate-y-full
          data-[direction=top]:data-starting-style:-translate-y-full`,
          `data-[direction=bottom]:inset-x-0 data-[direction=bottom]:bottom-0
          data-[direction=bottom]:mt-24 data-[direction=bottom]:max-h-[80vh]
          data-[direction=bottom]:w-full data-[direction=bottom]:rounded-t-lg
          data-[direction=bottom]:border-t
          data-[direction=bottom]:data-ending-style:translate-y-full
          data-[direction=bottom]:data-starting-style:translate-y-full`,
          `data-[direction=right]:inset-y-0 data-[direction=right]:right-0
          data-[direction=right]:h-full data-[direction=right]:w-3/4
          data-[direction=right]:border-l
          data-[direction=right]:data-ending-style:translate-x-full
          data-[direction=right]:data-starting-style:translate-x-full
          data-[direction=right]:sm:max-w-sm`,
          `data-[direction=left]:inset-y-0 data-[direction=left]:left-0
          data-[direction=left]:h-full data-[direction=left]:w-3/4
          data-[direction=left]:border-r
          data-[direction=left]:data-ending-style:-translate-x-full
          data-[direction=left]:data-starting-style:-translate-x-full
          data-[direction=left]:sm:max-w-sm`,
          className,
        )}
        {...props}
      >
        {handlebar && (
          <div
            className={cn(
              `bg-muted mx-auto mt-4 hidden h-2 w-25 shrink-0 rounded-full
              group-data-[direction=bottom]/drawer-content:block`,
              classNames?.handlebar,
            )}
          />
        )}
        {children}
      </DialogPrimitive.Popup>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        `flex flex-col gap-0.5 p-4
        group-data-[direction=bottom]/drawer-content:text-center
        group-data-[direction=top]/drawer-content:text-center md:gap-1.5
        md:text-left`,
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
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
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
