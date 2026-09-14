'use client';

import * as React from 'react';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../components/atoms/button';
import { OVERLAY_LAYER } from '../lib/z-layers';

/*
 * Base UI primitives with repo-owned styling; no longer vendored from shadcn.
 *
 * Notes on the Radix → Base UI shape change:
 * - Radix's `Dialog.Overlay` becomes Base UI's `Dialog.Backdrop`, and
 *   `Dialog.Content` becomes `Dialog.Popup`.
 * - Open/close styling moves from Radix's `data-[state=open|closed]:animate-*`
 *   (inert here — this package never defined those keyframes) to Base UI's
 *   `data-starting-style`/`data-ending-style` transition hooks, which are plain
 *   Tailwind transitions and actually animate.
 * - Pointer-outside dismissal (antd's `maskClosable`) is a *root*-level concern
 *   in Base UI (`disablePointerDismissal`), not a Content event. See
 *   `organisms/modal`.
 *
 * Local patches retained from the shadcn version:
 * - `OVERLAY_LAYER` (src/lib/z-layers.ts) replaces upstream's `z-50` on the
 *   backdrop and popup — this package is published and can't own the app's
 *   z-index scale (#359).
 * - `DialogContent` takes a `container` prop (default `useConfig().getContainer()`)
 *   passed to the portal, so portalled content stays inside the themed wrapper.
 * - `DialogContent` exposes `closable`/`closeIcon`/`classNames.mask` instead of
 *   upstream's `showCloseButton`.
 * - `DialogFooter`'s close button uses this library's Button vocabulary.
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Backdrop>) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        `fixed inset-0 bg-black/50 transition-opacity duration-200
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
  closeIcon?: React.ReactNode;
  closable?: boolean | { disabled?: boolean };
  container?: HTMLElement;
}

function DialogContent({
  className,
  children,
  classNames,
  closeIcon: _closeIcon,
  closable,
  container,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & CustomContentProps) {
  const { getContainer } = useConfig();
  const resolvedContainer = container ?? getContainer();

  const closeIcon = (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className="ring-offset-background focus:ring-ring data-open:bg-accent
        data-open:text-muted-foreground absolute top-4 right-4 rounded-xs
        opacity-70 transition-opacity hover:opacity-100 focus:ring-2
        focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none
        [&_svg]:pointer-events-none [&_svg]:shrink-0
        [&_svg:not([class*='size-'])]:size-4"
      disabled={typeof closable === 'object' && closable.disabled}
    >
      {_closeIcon || <XIcon />}
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  );

  return (
    <DialogPortal container={resolvedContainer}>
      <DialogOverlay className={cn(classNames?.mask)} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          `bg-background fixed top-[50%] left-[50%] grid w-full
          max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4
          rounded-lg border p-6 shadow-lg transition-[opacity,transform]
          duration-200 outline-none data-ending-style:scale-95
          data-ending-style:opacity-0 data-starting-style:scale-95
          data-starting-style:opacity-0 sm:max-w-lg`,
          OVERLAY_LAYER,
          className,
        )}
        {...props}
      >
        {children}
        {closable && closeIcon}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          render={<Button variant="outlined">Close</Button>}
        />
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
