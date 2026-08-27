'use client';

import { DEFAULT_LOCALE, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { skeleton } from '../../../core';

const { Skeleton: Core } = skeleton;

const getValueAtIndex = <T,>(value: T | T[], index: number) => {
  return Array.isArray(value) ? (value[index] ?? value[0]) : value;
};

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  active?: boolean;
  loading?: boolean;
  avatar?: boolean;
  size?: 'default' | 'small' | 'large';
  count?: number;
  gap?: number;
  direction?: 'horizontal' | 'vertical';
  width?: string | number | (string | number)[];
  height?: string | number | (string | number)[];
  classNames?: {
    wrapper?: string;
    avatar?: string;
    item?: string;
  };
}

const SIZES = {
  small: 'w-48 h-4',
  default: 'w-60 h-6',
  large: 'w-72 h-8',
};

const Skeleton = ({
  active = true,
  loading = true,
  avatar,
  size = 'default',
  direction = 'vertical',
  count = 1,
  gap = 6,
  className,
  classNames = {},
  style,
  width,
  height,
  children,
  ...props
}: Props) => {
  const { locale } = useConfig();

  // Not wrapping `children` here (unlike Spin's overlay mode) — Skeleton
  // is meant to swap in arbitrary real content once loading finishes,
  // which can include elements with strict parent requirements (e.g. a
  // `<tr>`), so adding a wrapper div could produce invalid markup.
  // `className`/`style`/rest props only ever describe the skeleton's own
  // placeholder markup, so there's nothing for them to apply to here.
  if (!loading) {
    return children ?? null;
  }

  return (
    <div
      role="status"
      aria-label={locale.loading ?? DEFAULT_LOCALE.loading}
      className={cn('flex items-center gap-3', className)}
      style={style}
      {...props}
    >
      {avatar && (
        <Core
          className={cn(
            'h-12 w-12',
            'rounded-xl',
            !active && 'animate-none',
            classNames.avatar,
          )}
        />
      )}
      <div
        className={cn(
          'flex grow',
          direction === 'vertical' && 'flex-col',
          classNames.wrapper,
        )}
        style={{
          gap,
        }}
      >
        {Array.from({ length: count }).map((_, index) => {
          const itemWidth = getValueAtIndex(width, index);
          const itemHeight = getValueAtIndex(height, index);

          return (
            <Core
              key={index}
              className={cn(
                'rounded-md',
                !active && 'animate-none',
                SIZES[size],
                classNames.item,
                //
              )}
              style={{
                width: itemWidth,
                height: itemHeight,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Skeleton;
