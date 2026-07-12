'use client';

import { Children, Fragment } from 'react';

import { resizable } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { ResizableHandle, ResizablePanel, ResizablePanelGroup } = resizable;

type SplitterLayout = Parameters<
  NonNullable<
    React.ComponentProps<typeof ResizablePanelGroup>['onLayoutChanged']
  >
>[0];

export interface SplitterPanelProps extends React.ComponentProps<
  typeof ResizablePanel
> {
  children: React.ReactNode;
}

export interface Props extends Omit<
  React.ComponentProps<typeof ResizablePanelGroup>,
  'children' | 'orientation' | 'onLayoutChange' | 'onLayoutChanged' | 'onResize'
> {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  withHandle?: boolean;
  handle?: React.ReactNode;
  handleClassName?: string;
  onResize?: (layout: SplitterLayout) => void;
  onResizeEnd?: (layout: SplitterLayout) => void;
}

type SplitterComponent = ((props: Props) => React.ReactNode) & {
  Panel: typeof SplitterPanel;
};

const SplitterPanel = ({
  children,
  className,
  ...props
}: SplitterPanelProps) => {
  return (
    <ResizablePanel
      className={cn('min-h-0 min-w-0 overflow-auto', className)}
      {...props}
    >
      {children}
    </ResizablePanel>
  );
};

const Splitter = (({
  children,
  className,
  orientation = 'horizontal',
  withHandle = true,
  handle,
  handleClassName,
  onResize,
  onResizeEnd,
  ...props
}: Props) => {
  const panels = Children.toArray(children);

  return (
    <ResizablePanelGroup
      className={cn(
        'border-border/60 h-full w-full rounded-lg border',
        className,
      )}
      orientation={orientation}
      onLayoutChange={onResize}
      onLayoutChanged={onResizeEnd}
      {...props}
    >
      {panels.map((panel, index) => (
        <Fragment key={index}>
          {panel}
          {index < panels.length - 1 && (
            <ResizableHandle
              className={cn(
                'hover:bg-border/80 data-separator-active:bg-border transition-colors',
                handleClassName,
              )}
              withHandle={withHandle && handle === undefined}
            >
              {handle}
            </ResizableHandle>
          )}
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
}) as SplitterComponent;

Splitter.Panel = SplitterPanel;

export default Splitter;
