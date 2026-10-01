'use client';

import { useState } from 'react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Skeleton from '../atoms/skeleton';
import Pagination, {
  type Props as PaginationProps,
} from '../molecules/pagination';
import Empty from '../templates/empty';

export type PaginationOptions = Omit<PaginationProps, 'total'> &
  ({ mode?: 'client'; total?: never } | { mode: 'server'; total: number });

export interface Column<T> {
  key: React.Key;
  title: React.ReactNode;
  /** Field displayed when render is omitted. */
  dataIndex?: keyof T;
  render?: (record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  className?: string;
  headerClassName?: string;
}

export interface Props<T> extends Omit<
  React.ComponentPropsWithoutRef<'table'>,
  'children'
> {
  columns: Column<T>[];
  data?: T[];
  /** Use a stable key when rows may be reordered or paged. */
  rowKey?: (record: T, index: number) => React.Key;
  caption?: React.ReactNode;
  loading?: boolean;
  empty?: React.ReactNode;
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  /** true paginates data locally; server mode expects current-page data. */
  pagination?: boolean | PaginationOptions;
  classNames?: {
    container?: string;
    header?: string;
    body?: string;
    row?: string;
    cell?: string;
    empty?: string;
    pagination?: string;
  };
}

const clampPage = (page: number, pageCount: number) =>
  Math.min(
    Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1),
    Math.max(1, pageCount),
  );

const normalizePageSize = (value: number) =>
  Number.isFinite(value) && value >= 1 ? Math.floor(value) : 10;

const Table = <T,>({
  columns,
  data = [],
  rowKey,
  loading = false,
  empty,
  size,
  bordered = false,
  striped = false,
  hoverable = true,
  pagination = false,
  caption,
  className,
  classNames,
  ...props
}: Props<T>) => {
  const { componentSize } = useConfig();
  const paginationOptions: PaginationOptions =
    typeof pagination === 'object' ? pagination : {};
  const {
    mode = 'client',
    total: serverTotal,
    page: controlledPage,
    defaultPage = 1,
    pageSize: controlledPageSize,
    defaultPageSize = 10,
    onChange,
    onPageSizeChange,
    ...paginationProps
  } = paginationOptions;
  const [internal, setInternal] = useState(() => ({
    page: defaultPage,
    pageSize: normalizePageSize(defaultPageSize),
    pageCount: 0,
  }));
  const pageSize = normalizePageSize(controlledPageSize ?? internal.pageSize);
  const total = mode === 'server' ? (serverTotal ?? 0) : data.length;
  const pageCount = Math.ceil(total / pageSize);

  if (
    pagination &&
    controlledPage === undefined &&
    internal.pageCount !== pageCount
  ) {
    setInternal(current => ({
      ...current,
      page: clampPage(current.page, pageCount),
      pageCount,
    }));
  }

  const page = clampPage(controlledPage ?? internal.page, pageCount);
  const visibleData =
    pagination && mode === 'client'
      ? data.slice((page - 1) * pageSize, page * pageSize)
      : data;
  const resolvedSize = size ?? componentSize ?? 'middle';
  const cellPadding = {
    small: 'px-3 py-2',
    middle: 'px-4 py-3',
    large: 'px-5 py-4',
  }[resolvedSize];

  const handlePageChange = (next: number) => {
    if (controlledPage === undefined) {
      setInternal(current => ({ ...current, page: next }));
    }

    onChange?.(next);
  };

  const handlePageSizeChange = (next: number) => {
    if (controlledPageSize === undefined || controlledPage === undefined) {
      setInternal(current => ({
        ...current,
        page: controlledPage === undefined ? 1 : current.page,
        pageSize: controlledPageSize === undefined ? next : current.pageSize,
        pageCount: Math.ceil(total / next),
      }));
    }

    onPageSizeChange?.(next);
  };

  return (
    <>
      <div
        data-slot="table-container"
        className={cn(
          'w-full overflow-x-auto',
          bordered && 'rounded-md border',
          classNames?.container,
          //
        )}
      >
        <table
          {...props}
          data-slot="table"
          aria-busy={loading || undefined}
          className={cn(
            'w-full min-w-max border-collapse text-sm',
            className,
            //
          )}
        >
          {caption && <caption className="mb-2 text-start">{caption}</caption>}
          <thead
            data-slot="table-header"
            className={cn(
              'bg-muted/50 border-b',
              classNames?.header,
              //
            )}
          >
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  scope="col"
                  style={{ width: column.width }}
                  className={cn(
                    'text-foreground font-medium',
                    cellPadding,
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.align === undefined && 'text-start',
                    bordered && 'border-e last:border-e-0',
                    classNames?.cell,
                    column.headerClassName,
                    //
                  )}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody data-slot="table-body" className={classNames?.body}>
            {loading ? (
              <tr>
                <td
                  colSpan={Math.max(columns.length, 1)}
                  className={cellPadding}
                >
                  <Skeleton count={3} className="py-2" />
                </td>
              </tr>
            ) : visibleData.length === 0 ? (
              <tr>
                <td
                  colSpan={Math.max(columns.length, 1)}
                  className={cn(cellPadding, classNames?.empty)}
                >
                  {empty ?? <Empty />}
                </td>
              </tr>
            ) : (
              visibleData.map((record, index) => (
                <tr
                  key={rowKey?.(record, index) ?? index}
                  data-slot="table-row"
                  className={cn(
                    'border-b last:border-b-0',
                    striped && 'even:bg-muted/30',
                    hoverable && 'hover:bg-muted/50',
                    classNames?.row,
                    //
                  )}
                >
                  {columns.map(column => {
                    const value =
                      column.dataIndex === undefined
                        ? undefined
                        : record[column.dataIndex];

                    return (
                      <td
                        key={column.key}
                        data-slot="table-cell"
                        className={cn(
                          cellPadding,
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          bordered && 'border-e last:border-e-0',
                          classNames?.cell,
                          column.className,
                          //
                        )}
                      >
                        {column.render
                          ? column.render(record, index)
                          : value == null
                            ? null
                            : String(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div
          data-slot="table-pagination"
          className={cn(
            'mt-4 flex justify-end',
            classNames?.pagination,
            //
          )}
        >
          <Pagination
            {...paginationProps}
            total={total}
            page={page}
            pageSize={pageSize}
            onChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </>
  );
};

export default Table;
