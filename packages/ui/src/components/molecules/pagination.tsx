'use client';

import { useState } from 'react';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../atoms/button';
import Input from '../atoms/input';
import Select from '../atoms/select';

type PageItem = number | 'start-ellipsis' | 'end-ellipsis';

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'nav'>,
  'children' | 'onChange'
> {
  /** Total number of items, not pages. */
  total: number;
  /** Controlled number of items per page. */
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  /** Render the total and the 1-based inclusive range of visible items. */
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  showQuickJumper?: boolean;
  /** 1-based controlled page. */
  page?: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  hideOnSinglePage?: boolean;
  /** Render available page controls as links to these URLs. */
  getPageHref?: (page: number) => string;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  labels?: {
    navigation?: string;
    page?: (page: number) => string;
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    pageSize?: string;
    jump?: string;
    go?: string;
  };
  classNames?: {
    item?: string;
    active?: string;
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    ellipsis?: string;
    total?: string;
    sizeChanger?: string;
    jumper?: string;
  };
}

const clampPage = (page: number, pageCount: number) =>
  Math.min(
    Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1),
    Math.max(1, pageCount),
  );

const normalizePageSize = (value: number) =>
  Number.isFinite(value) && value >= 1 ? Math.floor(value) : 10;

const getPageItems = (
  page: number,
  pageCount: number,
  siblingCount: number,
  boundaryCount: number,
): PageItem[] => {
  if (pageCount === 0) {
    return [];
  }

  const pages = new Set<number>();

  for (let index = 1; index <= boundaryCount && index <= pageCount; index++) {
    pages.add(index);
    pages.add(pageCount - index + 1);
  }

  for (
    let index = Math.max(1, page - siblingCount);
    index <= Math.min(pageCount, page + siblingCount);
    index++
  ) {
    pages.add(index);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];
  let previous = 0;

  for (const current of sorted) {
    const gap = current - previous;

    if (gap === 2) {
      items.push(previous + 1);
    } else if (gap > 2) {
      items.push('start-ellipsis');
    }

    items.push(current);
    previous = current;
  }

  const finalGap = pageCount - previous;

  if (finalGap === 1) {
    items.push(pageCount);
  } else if (finalGap > 1) {
    items.push('end-ellipsis');
  }

  return items;
};

const Pagination = ({
  total,
  pageSize,
  defaultPageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showSizeChanger = false,
  showTotal,
  showQuickJumper = false,
  page,
  defaultPage = 1,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = false,
  hideOnSinglePage = false,
  getPageHref,
  disabled = false,
  size,
  labels,
  className,
  classNames,
  'aria-label': ariaLabel,
  ...props
}: Props) => {
  const { componentSize, direction } = useConfig();
  const safeTotal = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  const [internalPageSize, setInternalPageSize] = useState(() =>
    normalizePageSize(defaultPageSize),
  );
  const safePageSize = normalizePageSize(pageSize ?? internalPageSize);
  const pageCount = Math.ceil(safeTotal / safePageSize);
  const [jumpValue, setJumpValue] = useState('');
  const [internal, setInternal] = useState({
    page: clampPage(defaultPage, pageCount),
    pageCount,
  });

  // React retries this render with the adjusted state when the available
  // range changes. Controlled callers still own their page prop.
  if (page === undefined && internal.pageCount !== pageCount) {
    setInternal({ page: clampPage(internal.page, pageCount), pageCount });
  }

  const currentPage = clampPage(page ?? internal.page, pageCount);
  const resolvedSize = size ?? componentSize ?? 'middle';
  const safeSiblingCount = Number.isFinite(siblingCount)
    ? Math.max(0, Math.floor(siblingCount))
    : 1;
  const safeBoundaryCount = Number.isFinite(boundaryCount)
    ? Math.max(0, Math.floor(boundaryCount))
    : 1;
  const items = getPageItems(
    currentPage,
    pageCount,
    safeSiblingCount,
    safeBoundaryCount,
  );
  const sizeOptions = Array.from(
    new Set(
      [...pageSizeOptions, safePageSize].filter(
        value => Number.isInteger(value) && value > 0,
      ),
    ),
  ).sort((a, b) => a - b);
  const range: [number, number] =
    safeTotal === 0
      ? [0, 0]
      : [
          (currentPage - 1) * safePageSize + 1,
          Math.min(currentPage * safePageSize, safeTotal),
        ];

  const goToPage = (next: number) => {
    if (
      disabled ||
      pageCount === 0 ||
      next < 1 ||
      next > pageCount ||
      next === currentPage
    ) {
      return;
    }

    if (page === undefined) {
      setInternal({ page: next, pageCount });
    }

    onChange?.(next);
  };

  const changePageSize = (next: number) => {
    if (disabled || next === safePageSize) {
      return;
    }

    if (pageSize === undefined) {
      setInternalPageSize(next);
    }

    if (page === undefined) {
      setInternal({ page: 1, pageCount: Math.ceil(safeTotal / next) });
    }

    onPageSizeChange?.(next);

    if (currentPage !== 1) {
      onChange?.(1);
    }
  };

  const jumpToPage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d+$/.test(jumpValue.trim())) {
      return;
    }

    const next = Number(jumpValue.trim());

    if (!Number.isSafeInteger(next) || next < 1 || next > pageCount) {
      return;
    }

    goToPage(next);
    setJumpValue('');
  };

  const handlePageClick = (next: number, event: React.MouseEvent) => {
    if (
      getPageHref &&
      (event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0)
    ) {
      return;
    }

    if (getPageHref && next === currentPage) {
      event.preventDefault();
    }

    goToPage(next);
  };

  const linkProps = (target: number, isDisabled: boolean) =>
    getPageHref && !isDisabled
      ? {
          render: <a href={getPageHref(target)} />,
          nativeButton: false,
          role: 'link',
        }
      : {};

  if (hideOnSinglePage && pageCount <= 1) {
    return null;
  }

  return (
    <nav
      {...props}
      data-slot="pagination"
      aria-label={ariaLabel ?? labels?.navigation ?? 'Pagination'}
      className={cn(
        'flex flex-wrap items-center gap-1',
        className,
        //
      )}
    >
      {showTotal && (
        <span
          data-slot="pagination-total"
          className={cn(
            'text-muted-foreground me-2 text-sm',
            classNames?.total,
            //
          )}
        >
          {showTotal(safeTotal, range)}
        </span>
      )}
      {showFirstLast && (
        <Button
          {...linkProps(1, disabled || pageCount === 0 || currentPage === 1)}
          icon={direction === 'rtl' ? <ChevronsRight /> : <ChevronsLeft />}
          size={resolvedSize}
          variant="outlined"
          aria-label={labels?.first ?? 'First page'}
          disabled={disabled || pageCount === 0 || currentPage === 1}
          className={cn(
            classNames?.item,
            classNames?.first,
            //
          )}
          onClick={event => handlePageClick(1, event)}
        />
      )}
      <Button
        {...linkProps(
          currentPage - 1,
          disabled || pageCount === 0 || currentPage === 1,
        )}
        icon={direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
        size={resolvedSize}
        variant="outlined"
        aria-label={labels?.previous ?? 'Previous page'}
        disabled={disabled || pageCount === 0 || currentPage === 1}
        className={cn(
          classNames?.item,
          classNames?.previous,
          //
        )}
        onClick={event => handlePageClick(currentPage - 1, event)}
      />
      {items.map((item, index) =>
        typeof item === 'number' ? (
          <Button
            key={item}
            {...linkProps(item, disabled)}
            size={resolvedSize}
            variant={item === currentPage ? 'solid' : 'outlined'}
            color={item === currentPage ? 'primary' : 'default'}
            aria-current={item === currentPage ? 'page' : undefined}
            aria-label={labels?.page?.(item) ?? `Page ${item}`}
            disabled={disabled}
            className={cn(
              'min-w-8',
              classNames?.item,
              item === currentPage && classNames?.active,
              //
            )}
            onClick={event => handlePageClick(item, event)}
          >
            {item}
          </Button>
        ) : (
          <span
            key={`${item}-${index}`}
            aria-hidden="true"
            className={cn(
              `text-muted-foreground inline-flex min-w-6 items-center
                justify-center`,
              classNames?.ellipsis,
              //
            )}
          >
            …
          </span>
        ),
      )}
      <Button
        {...linkProps(
          currentPage + 1,
          disabled || pageCount === 0 || currentPage === pageCount,
        )}
        icon={direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
        size={resolvedSize}
        variant="outlined"
        aria-label={labels?.next ?? 'Next page'}
        disabled={disabled || pageCount === 0 || currentPage === pageCount}
        className={cn(
          classNames?.item,
          classNames?.next,
          //
        )}
        onClick={event => handlePageClick(currentPage + 1, event)}
      />
      {showFirstLast && (
        <Button
          {...linkProps(
            pageCount,
            disabled || pageCount === 0 || currentPage === pageCount,
          )}
          icon={direction === 'rtl' ? <ChevronsLeft /> : <ChevronsRight />}
          size={resolvedSize}
          variant="outlined"
          aria-label={labels?.last ?? 'Last page'}
          disabled={disabled || pageCount === 0 || currentPage === pageCount}
          className={cn(
            classNames?.item,
            classNames?.last,
            //
          )}
          onClick={event => handlePageClick(pageCount, event)}
        />
      )}
      {showSizeChanger && (
        <div
          data-slot="pagination-size-changer"
          className={cn(
            'ms-2 min-w-24',
            classNames?.sizeChanger,
            //
          )}
        >
          <Select
            value={String(safePageSize)}
            options={sizeOptions.map(value => ({
              value: String(value),
              label: `${value} / page`,
            }))}
            onChange={value => changePageSize(Number(value))}
            disabled={disabled}
            aria-label={labels?.pageSize ?? 'Items per page'}
          />
        </div>
      )}
      {showQuickJumper && (
        <form
          data-slot="pagination-jumper"
          className={cn(
            'ms-2 flex items-center gap-1',
            classNames?.jumper,
            //
          )}
          onSubmit={jumpToPage}
          noValidate
        >
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-label={labels?.jump ?? 'Jump to page'}
            value={jumpValue}
            onChange={event => setJumpValue(event.target.value)}
            disabled={disabled || pageCount === 0}
            className="w-16"
          />
          <Button
            htmlType="submit"
            size={resolvedSize}
            variant="outlined"
            disabled={disabled || pageCount === 0}
          >
            {labels?.go ?? 'Go'}
          </Button>
        </form>
      )}
    </nav>
  );
};

export default Pagination;
