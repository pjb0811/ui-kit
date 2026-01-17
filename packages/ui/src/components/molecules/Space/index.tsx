import { Children, HTMLAttributes } from 'react';

import { cn } from '@repo/ui/utils';

import Skeleton from '../../atoms/Skeleton';

interface Props extends HTMLAttributes<HTMLDivElement> {
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
  size = 'middle',
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
  const [x, y] =
    typeof size === 'string'
      ? sizes[size] || [0, 0]
      : Array.isArray(size)
        ? size
        : [size, size];
  const count = Children.count(children);

  if (loading) {
    return <div className={cn(className)}>{loader || <Skeleton />}</div>;
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
