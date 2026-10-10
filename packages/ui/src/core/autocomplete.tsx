'use client';

import type { ComponentProps } from 'react';

import { Autocomplete as Primitive } from '@base-ui/react/autocomplete';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../lib/z-layers';

export const Autocomplete = Primitive.Root;
export const AutocompleteInput = Primitive.Input;
export const AutocompleteClear = Primitive.Clear;
export const AutocompleteList = Primitive.List;
export const AutocompleteItem = Primitive.Item;
export const AutocompleteEmpty = Primitive.Empty;

export function AutocompleteContent({
  container,
  className,
  ...props
}: ComponentProps<typeof Primitive.Popup> & { container?: HTMLElement }) {
  const { getContainer } = useConfig();

  return (
    <Primitive.Portal container={container ?? getContainer()}>
      <Primitive.Positioner
        side="bottom"
        align="start"
        sideOffset={4}
        className={cn(
          OVERLAY_LAYER,
          'w-(--anchor-width) max-w-(--available-width)', //
        )}
      >
        <Primitive.Popup
          data-slot="autocomplete-content"
          className={cn(
            `bg-popover text-popover-foreground max-h-(--available-height)
            origin-(--transform-origin) overflow-hidden rounded-md border
            shadow-md transition-[opacity,transform] duration-150
            data-ending-style:scale-95 data-ending-style:opacity-0
            data-starting-style:scale-95 data-starting-style:opacity-0`,
            className, //
          )}
          {...props}
        />
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}
