import type { ComponentPropsWithRef, Key, ReactNode } from 'react';

import { cn } from '@repo/ui/utils';

export interface Timestamp {
  /** Caller-formatted text. No locale or timezone conversion is performed. */
  label: ReactNode;
  /** A valid HTML time value, such as an ISO date or timestamp. */
  dateTime?: string;
}

export interface Item {
  key: Key;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: Timestamp;
  /** Decorative marker treatment. Include meaningful status in the event text. */
  status?: 'neutral' | 'primary' | 'error';
  /** Decorative content, such as an icon; do not supply interactive elements. */
  marker?: ReactNode;
}

export interface Props extends Omit<
  ComponentPropsWithRef<'ol'>,
  'children' | 'reversed' | 'start' | 'type'
> {
  /** Events render in this order; the component does not sort by timestamp. */
  items: readonly Item[];
  classNames?: {
    item?: string;
    marker?: string;
    connector?: string;
    content?: string;
    title?: string;
    description?: string;
    timestamp?: string;
  };
}

const Timeline = ({ items, className, classNames, ...props }: Props) => {
  return (
    <ol
      {...props}
      data-slot="timeline"
      role="list"
      className={cn(
        'text-foreground m-0 w-full min-w-0 list-none p-0',
        className, //
      )}
    >
      {items.map((item, index) => {
        const TimestampElement = item.timestamp?.dateTime ? 'time' : 'span';

        return (
          <li
            key={item.key}
            data-slot="timeline-item"
            data-status={item.status ?? 'neutral'}
            className={cn(
              'relative m-0 flex min-w-0 gap-3',
              index < items.length - 1 && 'pb-6',
              classNames?.item, //
            )}
          >
            <div aria-hidden="true" className="relative w-5 shrink-0">
              <span
                data-slot="timeline-marker"
                className={cn(
                  `border-border bg-background text-muted-foreground relative
                  z-10 flex size-5 items-center justify-center rounded-full
                  border-2 [&>svg]:size-3`,
                  item.status === 'primary' && 'border-primary text-primary',
                  item.status === 'error' &&
                    'border-destructive text-destructive',
                  classNames?.marker, //
                )}
              >
                {item.marker}
              </span>
              {index < items.length - 1 && (
                <span
                  data-slot="timeline-connector"
                  className={cn(
                    `bg-border absolute start-[calc(50%-0.5px)] top-5 -bottom-6
                    w-px`,
                    classNames?.connector, //
                  )}
                />
              )}
            </div>
            <div
              data-slot="timeline-content"
              className={cn(
                'min-w-0 flex-1 text-sm [overflow-wrap:anywhere]',
                classNames?.content, //
              )}
            >
              <div
                data-slot="timeline-title"
                className={cn(
                  'leading-5 font-medium',
                  classNames?.title, //
                )}
              >
                {item.title}
              </div>
              {item.timestamp != null && (
                <TimestampElement
                  data-slot="timeline-timestamp"
                  dateTime={
                    TimestampElement === 'time'
                      ? item.timestamp.dateTime
                      : undefined
                  }
                  className={cn(
                    'text-muted-foreground mt-1 block text-xs',
                    classNames?.timestamp, //
                  )}
                >
                  {item.timestamp.label}
                </TimestampElement>
              )}
              {item.description != null && (
                <div
                  data-slot="timeline-description"
                  className={cn(
                    'text-muted-foreground mt-2',
                    classNames?.description, //
                  )}
                >
                  {item.description}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Timeline;
