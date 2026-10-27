'use client';

import { Children, Fragment, isValidElement } from 'react';

import { cn } from '@repo/ui/utils';

import { resizable } from '../../../core';

const { ResizableHandle, ResizablePanelGroup } = resizable;

type SplitterLayout = Parameters<
  NonNullable<
    React.ComponentProps<typeof ResizablePanelGroup>['onLayoutChanged']
  >
>[0];

/** Props for a separator. `data-*` keys are allowed alongside the separator's own props. */
export type HandleProps = Omit<
  React.ComponentProps<typeof ResizableHandle>,
  'children' | 'withHandle'
> & {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export interface Props extends Omit<
  React.ComponentProps<typeof ResizablePanelGroup>,
  'children' | 'orientation' | 'onLayoutChange' | 'onLayoutChanged' | 'onResize'
> {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  withHandle?: boolean;
  handle?: React.ReactNode;
  handleClassName?: string;
  /**
   * Props for every separator, or a function that returns them per separator
   * (`index` 0 sits between the first and second panel). The separator uses `id`
   * to identify itself within the group, so give each separator its own `id`
   * through the function form.
   */
  handleProps?: HandleProps | ((index: number) => HandleProps);
  onResize?: (layout: SplitterLayout) => void;
  onResizeEnd?: (layout: SplitterLayout) => void;
}

const Splitter = ({
  children,
  className,
  orientation = 'horizontal',
  withHandle = true,
  handle,
  handleClassName,
  handleProps,
  onResize,
  onResizeEnd,
  ...props
}: Props) => {
  const panels = Children.toArray(children);

  const renderHandle = (index: number) => {
    const { className: handlePropsClassName, ...separatorProps } =
      typeof handleProps === 'function'
        ? handleProps(index)
        : (handleProps ?? {});

    return (
      <ResizableHandle
        {...separatorProps}
        className={cn(
          'transition-colors hover:bg-border/80 data-separator-active:bg-border',
          handleClassName,
          handlePropsClassName,
        )}
        withHandle={withHandle && handle === undefined}
      >
        {handle}
      </ResizableHandle>
    );
  };

  return (
    <ResizablePanelGroup
      className={cn(
        'h-full w-full rounded-lg border border-border/60',
        className,
      )}
      orientation={orientation}
      onLayoutChange={onResize}
      onLayoutChanged={onResizeEnd}
      {...props}
    >
      {panels.map((panel, index) => (
        <Fragment
          key={isValidElement(panel) && panel.key != null ? panel.key : index}
        >
          {panel}
          {index < panels.length - 1 && renderHandle(index)}
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
};

export default Splitter;
