'use client';

import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@repo/ui/utils';

import Skeleton from '../atoms/skeleton';

export interface Props extends Omit<
  ComponentProps<'div'>,
  'title' | 'children' | 'prefix'
> {
  title?: ReactNode;
  value?: string | number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  precision?: number;
  locale?: string;
  formatter?: (value: string | number) => ReactNode;
  loading?: boolean;
  classNames?: {
    title?: string;
    value?: string;
    prefix?: string;
    suffix?: string;
  };
}

const Statistic = ({
  title,
  value,
  prefix,
  suffix,
  precision,
  locale = 'en-US',
  formatter,
  loading = false,
  className,
  classNames,
  ...props
}: Props) => {
  const hasValue =
    value !== undefined &&
    value !== '' &&
    (typeof value !== 'number' || Number.isFinite(value));
  let formatted: ReactNode = '—';

  if (!loading && hasValue && value !== undefined) {
    if (formatter) {
      formatted = formatter(value);
    } else if (typeof value === 'string') {
      formatted = value;
    } else {
      const digits =
        precision !== undefined && Number.isFinite(precision)
          ? Math.min(20, Math.max(0, Math.trunc(precision)))
          : undefined;
      const options =
        digits === undefined
          ? undefined
          : {
              minimumFractionDigits: digits,
              maximumFractionDigits: digits,
            };

      try {
        formatted = new Intl.NumberFormat(locale, options).format(value);
      } catch {
        formatted = new Intl.NumberFormat('en-US', options).format(value);
      }
    }
  }

  return (
    <div
      {...props}
      data-slot="statistic"
      aria-busy={loading || undefined}
      className={cn(
        'min-w-0',
        className,
        //
      )}
    >
      {title !== undefined && title !== null && (
        <div
          className={cn(
            'mb-1 text-sm text-muted-foreground',
            classNames?.title,
            //
          )}
        >
          {title}
        </div>
      )}
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <div
          className={cn(
            `flex flex-wrap items-baseline gap-1 text-2xl font-semibold
              [overflow-wrap:anywhere] text-foreground tabular-nums`,
            classNames?.value,
            //
          )}
        >
          {prefix !== undefined && prefix !== null && (
            <span className={classNames?.prefix}>{prefix}</span>
          )}
          <span>{formatted}</span>
          {suffix !== undefined && suffix !== null && (
            <span
              className={cn(
                'text-base font-normal',
                classNames?.suffix,
                //
              )}
            >
              {suffix}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Statistic;
