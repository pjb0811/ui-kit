'use client';

import * as React from 'react';

import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { Menu as BaseMenu } from '@base-ui/react/menu';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { OVERLAY_LAYER } from '../../lib/z-layers';
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
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: Props) => {
  const { getContainer, direction } = useConfig();
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const actionRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [source, setSource] = React.useState<'context' | 'action'>('context');
  const hasActions = items.some(item => item.type !== 'separator');
  const isInactive = disabled || !hasActions;
  const resolvedOpen = open ?? isOpen;
  const resolvedDirection =
    triggerProps?.dir === 'rtl' || triggerProps?.dir === 'ltr'
      ? triggerProps.dir
      : direction;
  const handleOpenChange = (
    nextOpen: boolean,
    details: Parameters<NonNullable<Props['onOpenChange']>>[1],
    nextSource: typeof source,
  ) => {
    onOpenChange?.(nextOpen, details);

    if (details.isCanceled) {
      return;
    }

    if (nextOpen) {
      setSource(nextSource);
    }

    setIsOpen(nextOpen);
  };

  const popup = (
    <BaseMenu.Portal container={getContainer()}>
      <BaseMenu.Positioner sideOffset={4} className={OVERLAY_LAYER}>
        <BaseMenu.Popup
          data-slot="context-menu"
          dir={resolvedDirection}
          finalFocus={source === 'context' ? triggerRef : actionRef}
          className={cn(
            `bg-popover text-popover-foreground border-border
            max-h-[var(--available-height)] max-w-[var(--available-width)]
            min-w-40 overflow-auto rounded-md border p-1 shadow-md outline-none`,
            classNames?.popup,
            //
          )}
        >
          {items.map(item =>
            item.type === 'separator' ? (
              <BaseMenu.Separator
                key={item.key}
                className={cn(
                  'bg-border my-1 h-px',
                  classNames?.separator,
                  //
                )}
              />
            ) : (
              <BaseMenu.Item
                key={item.key}
                disabled={item.disabled}
                className={cn(
                  `data-highlighted:bg-accent
                    data-highlighted:text-accent-foreground cursor-default
                    rounded-sm px-3 py-2 text-sm break-words outline-none
                    data-disabled:opacity-50`,
                  classNames?.item,
                  //
                )}
                onClick={() => {
                  item.onSelect?.();
                  onSelect?.(item.key, item);
                }}
              >
                {item.label}
              </BaseMenu.Item>
            ),
          )}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );

  return (
    <DirectionProvider direction={resolvedDirection}>
      <BaseContextMenu.Root
        {...props}
        actionsRef={source === 'context' ? props.actionsRef : undefined}
        disabled={isInactive}
        open={resolvedOpen && source === 'context'}
        onOpenChange={(nextOpen, details) =>
          handleOpenChange(nextOpen, details, 'context')
        }
      >
        <BaseContextMenu.Trigger
          {...triggerProps}
          ref={triggerRef}
          data-slot="context-menu-trigger"
          dir={triggerProps?.dir ?? resolvedDirection}
          tabIndex={actionLabel ? -1 : (triggerProps?.tabIndex ?? 0)}
          className={cn(
            'focus-visible:ring-ring outline-none focus-visible:ring-2',
            classNames?.trigger,
            triggerProps?.className,
            //
          )}
        >
          {children}
        </BaseContextMenu.Trigger>
        {popup}
      </BaseContextMenu.Root>
      {actionLabel && (
        <BaseMenu.Root
          {...props}
          actionsRef={source === 'action' ? props.actionsRef : undefined}
          disabled={isInactive}
          open={resolvedOpen && source === 'action'}
          onOpenChange={(nextOpen, details) =>
            handleOpenChange(nextOpen, details, 'action')
          }
        >
          <BaseMenu.Trigger
            ref={actionRef}
            render={<Button size="small" variant="text" />}
          >
            {actionLabel}
          </BaseMenu.Trigger>
          {popup}
        </BaseMenu.Root>
      )}
    </DirectionProvider>
  );
};
export default ContextMenu;
