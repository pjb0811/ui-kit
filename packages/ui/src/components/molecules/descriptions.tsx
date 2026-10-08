import type {
  CSSProperties,
  ComponentPropsWithRef,
  Key,
  ReactNode,
} from 'react';

import { cn } from '@repo/ui/utils';

type ColumnCount = 1 | 2 | 3 | 4;
type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type Columns = ColumnCount | Partial<Record<Breakpoint, ColumnCount>>;

export interface Item {
  /** Stable key for the label/value pair. */
  key: Key;
  label: ReactNode;
  /** Missing or null values render empty; zero is preserved. */
  value?: ReactNode;
}

export interface Props extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'title'
> {
  items: readonly Item[];
  title?: ReactNode;
  /** Defaults to one column, two at md, and three at lg. Omitted breakpoints inherit the previous count. */
  columns?: Columns;
  /** Label placement relative to the value. Defaults to horizontal. */
  orientation?: 'horizontal' | 'vertical';
  classNames?: {
    title?: string;
    list?: string;
    item?: string;
    label?: string;
    value?: string;
  };
}

const BREAKPOINTS: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];

const Descriptions = ({
  items,
  title,
  columns = { base: 1, md: 2, lg: 3 },
  orientation = 'horizontal',
  className,
  classNames,
  style,
  ...props
}: Props) => {
  const columnStyles: Record<string, number> = {};
  let count = 1;

  for (const breakpoint of BREAKPOINTS) {
    const requested =
      typeof columns === 'number' ? columns : columns[breakpoint];

    if (requested !== undefined && Number.isFinite(requested)) {
      count = Math.min(4, Math.max(1, Math.floor(requested)));
    }

    columnStyles[`--descriptions-columns-${breakpoint}`] = count;
  }

  return (
    <div
      {...props}
      data-slot="descriptions"
      data-orientation={orientation}
      className={cn(
        'text-foreground w-full min-w-0',
        className, //
      )}
      style={{ ...columnStyles, ...style } as CSSProperties}
    >
      {title != null && (
        <div
          data-slot="descriptions-title"
          className={cn(
            'mb-4 text-base font-semibold',
            classNames?.title, //
          )}
        >
          {title}
        </div>
      )}
      <dl
        data-slot="descriptions-list"
        className={cn(
          `m-0 grid
          grid-cols-[repeat(var(--descriptions-columns-base),minmax(0,1fr))]
          gap-x-6 gap-y-4
          sm:grid-cols-[repeat(var(--descriptions-columns-sm),minmax(0,1fr))]
          md:grid-cols-[repeat(var(--descriptions-columns-md),minmax(0,1fr))]
          lg:grid-cols-[repeat(var(--descriptions-columns-lg),minmax(0,1fr))]
          xl:grid-cols-[repeat(var(--descriptions-columns-xl),minmax(0,1fr))]
          2xl:grid-cols-[repeat(var(--descriptions-columns-2xl),minmax(0,1fr))]`,
          classNames?.list,
          //
        )}
      >
        {items.map(item => (
          <div
            key={item.key}
            data-slot="descriptions-item"
            className={cn(
              'grid min-w-0 gap-2 text-sm',
              orientation === 'horizontal'
                ? 'grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-start'
                : 'grid-cols-1 content-start',
              classNames?.item,
              //
            )}
          >
            <dt
              data-slot="descriptions-label"
              className={cn(
                `text-muted-foreground min-w-0 font-medium
                [overflow-wrap:anywhere]`,
                classNames?.label, //
              )}
            >
              {item.label}
            </dt>
            <dd
              data-slot="descriptions-value"
              className={cn(
                'm-0 min-w-0 [overflow-wrap:anywhere]',
                classNames?.value, //
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Descriptions;
