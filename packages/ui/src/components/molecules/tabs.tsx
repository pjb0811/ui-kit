'use client';

import type { ReactNode } from 'react';

import { cn } from '@repo/ui/utils';

import { tabs } from '../../core';

const { Tabs: Core, TabsList, TabsTab, TabsPanel } = tabs;

export interface Item {
  key: string;
  label: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  /** Decorative icon rendered before the label with consistent spacing. */
  icon?: ReactNode;
}

export interface Props extends Omit<
  React.ComponentProps<typeof Core>,
  'children' | 'onChange'
> {
  items: Item[];
  /** Called when the selected tab changes. */
  onChange?: (value: string | number | null) => void;
  /** @deprecated Use `onChange` for the selected value. */
  onValueChange?: React.ComponentProps<typeof Core>['onValueChange'];
  listLabel?: string;
  /** Preserve inactive panel DOM and local state. */
  keepMounted?: boolean;
  /** Select a tab when arrow-key focus moves to it. */
  activateOnFocus?: boolean;
  /** Scroll the tab list when its items exceed the available space. */
  scrollable?: boolean;
  /** Give tabs equal width in horizontal mode; ignored when scrollable. */
  fitted?: boolean;
  /** Content shown after the tab list, outside the tablist role. */
  extra?: ReactNode;
  classNames?: {
    list?: string;
    tab?: string;
    panel?: string;
    extra?: string;
  };
}

const Tabs = ({
  items,
  listLabel = 'Tabs',
  keepMounted = false,
  activateOnFocus = false,
  scrollable = false,
  fitted = false,
  extra,
  classNames,
  defaultValue,
  onChange,
  onValueChange,
  orientation = 'horizontal',
  ...props
}: Props) => {
  const initialValue =
    defaultValue === undefined
      ? items.find(item => !item.disabled)?.key
      : defaultValue;

  return (
    <Core
      defaultValue={props.value === undefined ? initialValue : undefined}
      orientation={orientation}
      onValueChange={(value, eventDetails) => {
        onChange?.(value);
        onValueChange?.(value, eventDetails);
      }}
      {...props}
    >
      <div
        data-slot="tabs-bar"
        className={cn(
          'flex min-w-0 items-stretch',
          orientation === 'vertical' && 'min-h-0 shrink-0 flex-col',
          //
        )}
      >
        <TabsList
          aria-label={listLabel}
          activateOnFocus={activateOnFocus}
          className={cn(
            'min-w-0 flex-1',
            scrollable &&
              (orientation === 'vertical'
                ? 'min-h-0 overflow-y-auto'
                : `[scrollbar-width:none] overflow-x-auto overflow-y-hidden
                  [&::-webkit-scrollbar]:hidden`),
            classNames?.list,
            //
          )}
        >
          {items.map(item => (
            <TabsTab
              key={item.key}
              value={item.key}
              disabled={item.disabled}
              className={cn(
                fitted &&
                  !scrollable &&
                  orientation === 'horizontal' &&
                  'flex-1',
                scrollable && 'shrink-0',
                classNames?.tab,
                //
              )}
            >
              {item.icon != null && (
                <span
                  data-slot="tabs-icon"
                  aria-hidden="true"
                  className="inline-flex shrink-0 items-center"
                >
                  {item.icon}
                </span>
              )}
              {item.label}
            </TabsTab>
          ))}
        </TabsList>
        {extra != null && (
          <div
            data-slot="tabs-extra"
            className={cn(
              `border-border flex shrink-0 items-center border-b px-3
              data-[orientation=vertical]:border-r
              data-[orientation=vertical]:border-b-0`,
              classNames?.extra,
              //
            )}
            data-orientation={orientation}
          >
            {extra}
          </div>
        )}
      </div>
      {items.map(item => (
        <TabsPanel
          key={item.key}
          value={item.key}
          keepMounted={keepMounted}
          className={classNames?.panel}
        >
          {item.children}
        </TabsPanel>
      ))}
    </Core>
  );
};

export default Tabs;
