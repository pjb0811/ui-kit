'use client';

import React, { Fragment, useEffect } from 'react';

import { useIntersectionObserver } from '@uidotdev/usehooks';

import { cn } from '@repo/ui/utils';

import { Skeleton } from '../../atoms';
import Item from './Item';

interface Props<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  loading?: boolean;
  loaderProps?: React.ComponentProps<typeof Skeleton>;
  loader?: React.ReactNode;
  title?: React.ReactNode;
  header?: React.ReactNode;
  empty?: React.ReactNode;
  classNames?: {
    title?: string;
    header?: string;
    body?: string;
  };
  scroll?: {
    hasMore: boolean;
    loading: boolean;
    loader?: React.ReactNode;
    options?: IntersectionObserverInit;
    next: () => void;
  };
  data?: T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
}

const List = <T,>({
  loading,
  loaderProps,
  loader,
  header,
  title,
  empty,
  scroll,
  data,
  className,
  classNames,
  renderItem = () => null,
  ...props
}: Props<T>) => {
  const [loaderRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
    ...scroll?.options,
  });

  useEffect(() => {
    if (!scroll) {
      return;
    }

    if (entry?.isIntersecting && scroll.hasMore && !scroll.loading) {
      scroll.next();
    }
  }, [entry, scroll]);

  if (loading) {
    return (
      loader || (
        <div className={cn(className)} {...props}>
          <div className={cn(classNames?.title)}>{title && <Skeleton />}</div>
          <div className={cn(classNames?.header)}>
            {header && <Skeleton size="small" />}
          </div>
          <div className={cn('space-y-2', classNames?.body)}>
            <Skeleton.Node count={10} gap={10} {...loaderProps} />
          </div>
        </div>
      )
    );
  }

  if (!data?.length && empty) {
    return empty;
  }

  return (
    <div
      className={cn(
        className,
        //
      )}
      {...props}
    >
      <div className={cn(classNames?.title)}>{title}</div>
      <div className={cn(classNames?.header)}>{header}</div>
      <div className={cn('space-y-2', classNames?.body)}>
        {data?.map((item, i) => (
          <Fragment key={i}>{renderItem(item, i)}</Fragment>
        ))}
        {scroll?.loading &&
          (scroll?.loader ?? (
            <Skeleton.Node count={10} gap={10} {...loaderProps} />
          ))}
        <div ref={loaderRef} />
      </div>
    </div>
  );
};

List.Item = Item;

export default List;
