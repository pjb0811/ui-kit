'use client';

import { useMemo } from 'react';

import { useResponsiveSize } from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import { RowContext } from './row-context';

const ALIGN_CLASSES = {
  top: 'items-start',
  middle: 'items-center',
  bottom: 'items-end',
  stretch: 'items-stretch',
};

const JUSTIFY_CLASSES = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  'space-around': 'justify-around',
  'space-between': 'justify-between',
  'space-evenly': 'justify-evenly',
};

export interface Props extends React.ComponentProps<'div'> {
  gutter?: number | [number, number];
  align?: keyof typeof ALIGN_CLASSES;
  justify?: keyof typeof JUSTIFY_CLASSES;
  wrap?: boolean;
}

// The breakpoint tier is resolved once here (not per-Col) so N columns
// share a single resize listener instead of each mounting its own via
// useResponsiveSize — matters once a grid has more than a couple Cols.
const Row = ({
  gutter = 0,
  align,
  justify,
  wrap = true,
  className,
  style,
  children,
  ...props
}: Props) => {
  const [gutterX, gutterY] = Array.isArray(gutter) ? gutter : [gutter, 0];
  const { breakpoint } = useResponsiveSize({ viewport: true });

  const contextValue = useMemo(
    () => ({ gutterX, gutterY, breakpoint: breakpoint.current }),
    [gutterX, gutterY, breakpoint],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <div
        className={cn(
          'flex',
          wrap && 'flex-wrap',
          align && ALIGN_CLASSES[align],
          justify && JUSTIFY_CLASSES[justify],
          className,
          //
        )}
        style={{
          // Negative margin + Col's matching padding is the classic
          // gutter technique — unlike a plain `gap`, it doesn't break the
          // percentage-width math when several Cols are meant to sum to
          // exactly 100% of the row. Vertical gutter has no such
          // constraint (it only affects spacing *between* wrapped rows),
          // so it uses native `row-gap` directly.
          marginLeft: gutterX ? -gutterX / 2 : undefined,
          marginRight: gutterX ? -gutterX / 2 : undefined,
          rowGap: gutterY || undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </RowContext.Provider>
  );
};

export default Row;
