'use client';

import { useState } from 'react';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { cn } from '@repo/ui/utils';

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'aside'>,
  'onCollapse'
> {
  width?: number | string;
  collapsedWidth?: number | string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  reverseArrow?: boolean;
  trigger?: React.ReactNode;
  classNames?: {
    trigger?: string;
  };
  onCollapse?: (collapsed: boolean) => void;
}

const toCssSize = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value;

const Sider = ({
  children,
  className,
  classNames,
  style,
  width = 200,
  collapsedWidth = 80,
  collapsible = false,
  defaultCollapsed = false,
  collapsed: _collapsed,
  reverseArrow = false,
  trigger,
  onCollapse: _onCollapse = () => {},
  ...props
}: Props) => {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    useState(defaultCollapsed);

  const controlled = _collapsed !== undefined;
  const collapsed = controlled ? _collapsed : uncontrolledCollapsed;

  const onCollapse = () => {
    const next = !collapsed;

    if (!controlled) {
      setUncontrolledCollapsed(next);
    }
    _onCollapse(next);
  };

  const TriggerIcon =
    collapsed !== reverseArrow ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        'z-100 flex h-full shrink-0 flex-col overflow-hidden',
        'transition-[width] duration-200',
        className,
        //
      )}
      style={{
        width: toCssSize(collapsed ? collapsedWidth : width),
        ...style,
      }}
      {...props}
    >
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      {collapsible && (
        <button
          type="button"
          aria-label={collapsed ? '펼치기' : '접기'}
          onClick={onCollapse}
          className={cn(
            'flex w-full shrink-0 items-center justify-center py-2',
            'cursor-pointer transition-colors hover:bg-black/5',
            classNames?.trigger,
            //
          )}
        >
          {trigger ?? <TriggerIcon className="size-4" />}
        </button>
      )}
    </aside>
  );
};

export default Sider;
