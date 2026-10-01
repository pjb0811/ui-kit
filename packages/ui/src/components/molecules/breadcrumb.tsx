'use client';

import { Fragment } from 'react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';
import Popover from '../atoms/popover';

export interface Item {
  key?: React.Key;
  title: React.ReactNode;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  'aria-label'?: string;
  /** Decorative icon placed before the title. */
  icon?: React.ReactNode;
  /** Overrides the separator after this item. */
  separator?: React.ReactNode;
}

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'nav'>,
  'children'
> {
  items: Item[];
  separator?: React.ReactNode;
  /** Collapse middle items when the trail has more than this many entries. */
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  expandText?: string;
  /** Render custom router links. The renderer owns aria-current for the last item. */
  itemRender?: (
    item: Item,
    index: number,
    isCurrent: boolean,
  ) => React.ReactNode;
  classNames?: {
    list?: string;
    item?: string;
    link?: string;
    current?: string;
    separator?: string;
    collapsed?: string;
    popup?: string;
  };
}

const safeCount = (value: number, minimum: number) =>
  Number.isFinite(value) ? Math.max(minimum, Math.floor(value)) : minimum;

const Breadcrumb = ({
  items,
  separator = '/',
  maxItems = 8,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  expandText = 'Show path',
  itemRender,
  className,
  classNames,
  dir,
  'aria-label': ariaLabel,
  ...props
}: Props) => {
  const { direction } = useConfig();
  const limit = safeCount(maxItems, 3);
  const before = Math.min(safeCount(itemsBeforeCollapse, 1), limit - 2);
  const after = Math.min(safeCount(itemsAfterCollapse, 1), limit - before - 1);
  const collapsed = items.length > limit && items.length - before - after > 0;
  const visibleIndices = collapsed
    ? [
        ...Array.from({ length: before }, (_, index) => index),
        ...Array.from(
          { length: after },
          (_, index) => items.length - after + index,
        ),
      ]
    : items.map((_, index) => index);
  const hiddenIndices = collapsed
    ? Array.from(
        { length: items.length - before - after },
        (_, index) => before + index,
      )
    : [];

  const renderItem = (index: number) => {
    const item = items[index]!;
    const isCurrent = index === items.length - 1;

    if (itemRender) {
      return itemRender(item, index, isCurrent);
    }

    const content = (
      <>
        {item.icon != null && (
          <span
            data-slot="breadcrumb-icon"
            aria-hidden="true"
            className="inline-flex shrink-0"
          >
            {item.icon}
          </span>
        )}
        {item.title}
      </>
    );
    const itemClassName = cn(
      'inline-flex items-center gap-1.5 rounded-sm',
      (item.href !== undefined || item.onClick) &&
        'hover:text-foreground focus-visible:outline-ring focus-visible:outline-2',
      isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground',
      (item.href !== undefined || item.onClick) && classNames?.link,
      isCurrent && classNames?.current,
      item.className,
      //
    );

    if (item.href !== undefined) {
      return (
        <a
          href={item.href}
          target={item.target}
          rel={item.rel}
          onClick={item.onClick}
          aria-label={item['aria-label']}
          aria-current={isCurrent ? 'page' : undefined}
          className={itemClassName}
        >
          {content}
        </a>
      );
    }

    if (item.onClick) {
      return (
        <Button
          variant="text"
          size="small"
          onClick={item.onClick}
          aria-label={item['aria-label']}
          aria-current={isCurrent ? 'page' : undefined}
          className={cn('h-auto px-0 py-0 font-normal', itemClassName)}
        >
          {content}
        </Button>
      );
    }

    return (
      <span
        aria-label={item['aria-label']}
        aria-current={isCurrent ? 'page' : undefined}
        className={itemClassName}
      >
        {content}
      </span>
    );
  };

  const renderSeparator = (index: number) => (
    <li
      data-slot="breadcrumb-separator"
      aria-hidden="true"
      className={cn(
        'text-muted-foreground mx-2 shrink-0',
        classNames?.separator,
        //
      )}
    >
      {items[index]?.separator ?? separator}
    </li>
  );

  return (
    <nav
      {...props}
      data-slot="breadcrumb"
      dir={dir ?? direction}
      aria-label={ariaLabel ?? 'Breadcrumb'}
      className={cn(
        'text-sm',
        className, //
      )}
    >
      <ol
        data-slot="breadcrumb-list"
        className={cn(
          'm-0 flex min-w-0 flex-wrap items-center p-0',
          classNames?.list,
          //
        )}
      >
        {visibleIndices.map((index, position) => (
          <Fragment key={items[index]?.key ?? index}>
            {position > 0 &&
              renderSeparator(
                collapsed && position === before
                  ? index - 1
                  : visibleIndices[position - 1]!,
              )}
            <li
              data-slot="breadcrumb-item"
              className={cn(
                'inline-flex min-w-0 items-center',
                classNames?.item, //
              )}
            >
              {renderItem(index)}
            </li>
            {collapsed && position === before - 1 && (
              <>
                {renderSeparator(index)}
                <li
                  data-slot="breadcrumb-collapsed"
                  className={classNames?.collapsed}
                >
                  <Popover
                    placement="bottom"
                    className={classNames?.popup}
                    content={
                      <ol className="m-0 grid list-none gap-1 p-0">
                        {hiddenIndices.map(hiddenIndex => (
                          <li key={items[hiddenIndex]?.key ?? hiddenIndex}>
                            {renderItem(hiddenIndex)}
                          </li>
                        ))}
                      </ol>
                    }
                  >
                    <Button
                      variant="text"
                      size="small"
                      aria-label={expandText}
                      className="h-auto px-1"
                    >
                      …
                    </Button>
                  </Popover>
                </li>
              </>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
