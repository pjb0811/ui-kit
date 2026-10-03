'use client';

import * as React from 'react';

import { Check, TriangleAlert } from 'lucide-react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

export interface Item {
  key?: React.Key;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** Mark a failed step regardless of its position. */
  status?: 'error';
}

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'nav'>,
  'children'
> {
  items: readonly Item[];
  /** Zero-based index of the current step. */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  classNames?: {
    list?: string;
    item?: string;
    indicator?: string;
    title?: string;
    description?: string;
    connector?: string;
  };
}

const Steps = ({
  items,
  current = 0,
  orientation = 'horizontal',
  className,
  classNames,
  dir,
  'aria-label': ariaLabel,
  ...props
}: Props) => {
  const { direction } = useConfig();
  const currentIndex = items.length
    ? Math.min(
        Math.max(Number.isFinite(current) ? Math.floor(current) : 0, 0),
        items.length - 1,
      )
    : -1;

  return (
    <nav
      {...props}
      data-slot="steps"
      data-orientation={orientation}
      dir={dir ?? direction}
      aria-label={ariaLabel ?? 'Progress'}
      className={cn('w-full', className)}
    >
      <ol
        data-slot="steps-list"
        className={cn(
          'm-0 flex list-none p-0',
          orientation === 'vertical' && 'flex-col',
          classNames?.list,
          //
        )}
      >
        {items.map((item, index) => {
          const status =
            item.status === 'error'
              ? 'error'
              : index < currentIndex
                ? 'complete'
                : index === currentIndex
                  ? 'current'
                  : 'upcoming';
          const isCurrent = index === currentIndex;

          return (
            <li
              key={item.key ?? index}
              data-slot="steps-item"
              data-status={status}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'm-0 flex min-w-0',
                orientation === 'horizontal'
                  ? 'flex-1 items-start'
                  : 'flex-col',
                classNames?.item,
                //
              )}
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  data-slot="steps-indicator"
                  aria-hidden="true"
                  className={cn(
                    `border-border text-muted-foreground flex size-7 shrink-0
                    items-center justify-center rounded-full border text-sm
                    font-medium`,
                    status === 'complete' &&
                      'border-primary bg-primary text-primary-foreground',
                    status === 'current' && 'border-primary text-primary',
                    status === 'error' &&
                      `border-destructive bg-destructive
                      text-destructive-foreground`,
                    classNames?.indicator,
                    //
                  )}
                >
                  {item.icon ??
                    (status === 'complete' ? (
                      <Check className="size-4" />
                    ) : status === 'error' ? (
                      <TriangleAlert className="size-4" />
                    ) : (
                      index + 1
                    ))}
                </span>
                <span className="min-w-0">
                  <span
                    data-slot="steps-title"
                    className={cn(
                      'block text-sm font-medium',
                      status === 'upcoming'
                        ? 'text-muted-foreground'
                        : status === 'error'
                          ? 'text-destructive'
                          : 'text-foreground',
                      classNames?.title,
                      //
                    )}
                  >
                    {item.title}
                  </span>
                  {item.description != null && (
                    <span
                      data-slot="steps-description"
                      className={cn(
                        'text-muted-foreground block text-xs',
                        classNames?.description,
                      )}
                    >
                      {item.description}
                    </span>
                  )}
                  <span className="sr-only">
                    {status === 'complete'
                      ? 'Completed'
                      : status === 'current'
                        ? 'Current step'
                        : status === 'error'
                          ? 'Error'
                          : 'Upcoming'}
                  </span>
                </span>
              </div>
              {index < items.length - 1 && (
                <span
                  data-slot="steps-connector"
                  aria-hidden="true"
                  className={cn(
                    'bg-border shrink-0',
                    orientation === 'horizontal'
                      ? 'mx-3 mt-3.5 h-px min-w-3 flex-1'
                      : 'my-2 ms-3.5 h-7 w-px',
                    index < currentIndex && 'bg-primary',
                    classNames?.connector,
                    //
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Steps;
