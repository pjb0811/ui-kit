'use client';

import { Children } from 'react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Skeleton from '../atoms/skeleton';

export interface Props extends React.ComponentPropsWithRef<'div'> {
  loading?: boolean;
  loader?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'middle' | 'large' | number | number[];
  align?: 'start' | 'end' | 'center' | 'baseline';
  wrap?: boolean;
  split?: React.ReactNode;
  grid?: {
    rows?: number;
    cols?: number;
  };
}

const sizes: Record<string, number[]> = {
  small: [4, 4],
  middle: [8, 8],
  large: [16, 16],
};

const aligns: Record<string, string> = {
  start: 'items-start text-start',
  end: 'items-end text-end',
  center: 'items-center text-center',
  baseline: 'items-baseline text-baseline',
};

const Space = ({
  loading,
  loader,
  children,
  size,
  orientation = 'horizontal',
  align = 'center',
  wrap = false,
  split,
  className,
  grid,
  hidden,
  style,
  ...props
}: Props) => {
  const { componentSize } = useConfig();
  // `size` overrides the global `componentSize` from `Config`, which in turn
  // falls back to `middle` — the same resolution order `Button` uses so a single
  // `<Config componentSize>` sizes both. Numeric/array gaps bypass the token.
  const resolvedSize = size ?? componentSize ?? 'middle';
  const [x, y] =
    typeof resolvedSize === 'string'
      ? sizes[resolvedSize] || [0, 0]
      : Array.isArray(resolvedSize)
        ? resolvedSize
        : [resolvedSize, resolvedSize];
  const count = Children.count(children);

  if (loading) {
    return (
      <div
        className={cn(hidden && 'hidden', className)}
        style={style}
        hidden={hidden}
        {...props}
      >
        {loader || <Skeleton />}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-nowrap',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        wrap && 'flex-wrap',
        aligns[align],
        grid && 'grid',
        hidden && 'hidden',
        className,
      )}
      style={{
        columnGap: x,
        rowGap: y,
        gridTemplateRows: grid?.rows
          ? `repeat(${grid.rows}, minmax(0, 1fr))`
          : undefined,
        gridTemplateColumns: grid?.cols
          ? `repeat(${grid.cols}, minmax(0, 1fr))`
          : undefined,
        ...style,
      }}
      hidden={hidden}
      {...props}
    >
      {Children.map(children, (child, i) => (
        <>
          {child}
          {split && i < count - 1 && split}
        </>
      ))}
    </div>
  );
};

export default Space;
