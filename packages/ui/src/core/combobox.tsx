'use client';

import * as React from 'react';

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { CheckIcon } from 'lucide-react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../lib/z-layers';

export type RootProps<
  Value,
  Item = Value,
  Multiple extends boolean | undefined = false,
> = ComboboxPrimitive.Root.Props<Value, Multiple, Item>;

const Combobox = ComboboxPrimitive.Root;
const ComboboxInput = ComboboxPrimitive.Input;
const ComboboxInputGroup = ComboboxPrimitive.InputGroup;
const ComboboxTrigger = ComboboxPrimitive.Trigger;
const ComboboxValue = ComboboxPrimitive.Value;
const ComboboxIcon = ComboboxPrimitive.Icon;
const ComboboxGroup = ComboboxPrimitive.Group;
const ComboboxGroupLabel = ComboboxPrimitive.GroupLabel;
const ComboboxCollection = ComboboxPrimitive.Collection;
const ComboboxClear = ComboboxPrimitive.Clear;
const ComboboxChips = ComboboxPrimitive.Chips;
const ComboboxChip = ComboboxPrimitive.Chip;
const ComboboxChipRemove = ComboboxPrimitive.ChipRemove;
const createItems = ComboboxPrimitive.createItems;

function ComboboxContent({
  className,
  children,
  container,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup> & {
  container?: HTMLElement;
}) {
  const { getContainer } = useConfig();

  return (
    <ComboboxPrimitive.Portal container={container ?? getContainer()}>
      <ComboboxPrimitive.Positioner
        side="bottom"
        align="start"
        sideOffset={4}
        className={cn(OVERLAY_LAYER, 'min-w-(--anchor-width)')}
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            `bg-popover text-popover-foreground max-h-(--available-height)
            origin-(--transform-origin) overflow-hidden rounded-md border
            shadow-md transition-[opacity,transform] duration-150
            data-ending-style:scale-95 data-ending-style:opacity-0
            data-starting-style:scale-95 data-starting-style:opacity-0`,
            className,
            //
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn('max-h-60 overflow-y-auto p-1', className)}
      {...props}
    />
  );
}

function ComboboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Item>) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        `data-highlighted:bg-accent data-highlighted:text-accent-foreground
        relative flex w-full cursor-default items-center rounded-sm py-1.5 ps-2
        pe-8 text-sm outline-hidden select-none
        data-disabled:pointer-events-none data-disabled:opacity-50`,
        className,
        //
      )}
      {...props}
    >
      <ComboboxPrimitive.ItemIndicator
        data-slot="combobox-item-indicator"
        className="absolute end-2 flex size-3.5 items-center justify-center"
      >
        <CheckIcon className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
      {children}
    </ComboboxPrimitive.Item>
  );
}

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        'text-muted-foreground px-2 py-3 text-center text-sm empty:p-0',
        className,
      )}
      {...props}
    />
  );
}

export {
  Combobox,
  ComboboxClear,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxIcon,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  createItems,
};
