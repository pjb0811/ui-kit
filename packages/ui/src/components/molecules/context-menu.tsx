'use client';

import * as React from 'react';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';

export type Item =
  | {
      key: React.Key;
      label: React.ReactNode;
      disabled?: boolean;
      type?: 'action';
      onSelect?: () => void;
    }
  | { key: React.Key; type: 'separator' };

export interface Props extends Omit<
  React.ComponentProps<typeof BaseContextMenu.Root>,
  'children'
> {
  children: React.ReactNode;
  items: Item[];
  onSelect?: (
    key: React.Key,
    item: Extract<Item, { label: React.ReactNode }>,
  ) => void;
  /** Visible action button for touch and discoverability; omit to hide it. */
  actionLabel?: string;
  triggerProps?: Omit<
    React.ComponentProps<typeof BaseContextMenu.Trigger>,
    'children' | 'render' | 'ref'
  >;
  classNames?: {
    trigger?: string;
    popup?: string;
    item?: string;
    separator?: string;
  };
}

const ContextMenu = ({
  children,
  items,
  onSelect,
  actionLabel,
  triggerProps,
  classNames,
  disabled = false,
  ...props
}: Props) => {
  const { getContainer } = useConfig();
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const available = items.some(item => item.type !== 'separator');
  const inactive = disabled || !available;
  const openAt = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    element.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
        button: 2,
      }),
    );
  };
  return (
    <BaseContextMenu.Root {...props} disabled={inactive}>
      <BaseContextMenu.Trigger
        {...triggerProps}
        ref={triggerRef}
        data-slot="context-menu-trigger"
        tabIndex={triggerProps?.tabIndex ?? 0}
        className={cn(
          'focus-visible:ring-ring outline-none focus-visible:ring-2',
          classNames?.trigger,
          triggerProps?.className,
        )}
        onKeyDown={event => {
          triggerProps?.onKeyDown?.(event);
          if (
            !inactive &&
            !event.defaultPrevented &&
            (event.key === 'ContextMenu' ||
              (event.shiftKey && event.key === 'F10'))
          ) {
            event.preventDefault();
            openAt(event.target as HTMLElement);
          }
        }}
      >
        {children}
        {actionLabel && (
          <Button
            disabled={inactive}
            size="small"
            variant="text"
            aria-haspopup="menu"
            onClick={event => openAt(event.currentTarget)}
          >
            {actionLabel}
          </Button>
        )}
      </BaseContextMenu.Trigger>
      <BaseContextMenu.Portal container={getContainer()}>
        <BaseContextMenu.Positioner sideOffset={4} className="z-50">
          <BaseContextMenu.Popup
            data-slot="context-menu"
            finalFocus={triggerRef}
            className={cn(
              `bg-popover text-popover-foreground border-border
              max-h-[var(--available-height)] max-w-[var(--available-width)]
              min-w-40 overflow-auto rounded-md border p-1 shadow-md
              outline-none`,
              classNames?.popup,
            )}
          >
            {items.map(item =>
              item.type === 'separator' ? (
                <BaseContextMenu.Separator
                  key={item.key}
                  className={cn('bg-border my-1 h-px', classNames?.separator)}
                />
              ) : (
                <BaseContextMenu.Item
                  key={item.key}
                  disabled={item.disabled}
                  className={cn(
                    `data-highlighted:bg-accent
                      data-highlighted:text-accent-foreground cursor-default
                      rounded-sm px-3 py-2 text-sm break-words outline-none
                      data-disabled:opacity-50`,
                    classNames?.item,
                  )}
                  onClick={() => {
                    item.onSelect?.();
                    onSelect?.(item.key, item);
                  }}
                >
                  {item.label}
                </BaseContextMenu.Item>
              ),
            )}
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </BaseContextMenu.Root>
  );
};
export default ContextMenu;
