'use client';

import React, { useEffect, useRef } from 'react';

import { useIntersectionObserver } from '@uidotdev/usehooks';

import { cn, renderConditional } from '@repo/ui/utils';

import Skeleton from '../../atoms/skeleton';
import { Title } from '../../atoms/typography';

interface Props<T> extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'title'
> {
  loading?: boolean;
  loaderProps?: React.ComponentProps<typeof Skeleton>;
  loader?: React.ReactNode;
  title?: React.ReactNode;
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
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
  itemKey?: (item: T, index: number) => React.Key;
}

const List = <T,>({
  loading,
  loaderProps,
  loader,
  header,
  title,
  titleLevel = 2,
  empty,
  scroll,
  data,
  className,
  classNames,
  renderItem = () => null,
  itemKey,
  ...props
}: Props<T>) => {
  const [loaderRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
    ...scroll?.options,
  });

  // `scroll` is typically a new object identity every render, so this
  // effect re-runs often. Guard with a ref (updated synchronously, unlike
  // the `loading` prop which only reflects the caller's next state update)
  // to avoid firing `next()` again for the same in-flight request before
  // the caller's `loading` has had a chance to become true.
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (!scroll) {
      return;
    }

    if (scroll.loading) {
      fetchingRef.current = false;
      return;
    }

    if (entry?.isIntersecting && scroll.hasMore && !fetchingRef.current) {
      fetchingRef.current = true;
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
    return (
      <div className={cn(className)} {...props}>
        {empty}
      </div>
    );
  }

  return (
    <div
      className={cn(
        className,
        //
      )}
      {...props}
    >
      {renderConditional(title, v => (
        <Title
          level={titleLevel}
          className={cn(
            'px-1.5 py-4',
            'text-black-90 text-lg leading-5.75 font-bold',
            //
          )}
        >
          {v}
        </Title>
      ))}
      <div className={cn(classNames?.header)}>{header}</div>
      <div role="list" className={cn('space-y-2', classNames?.body)}>
        {data?.map((item, i) =>
          itemKey ? (
            <React.Fragment key={itemKey(item, i)}>
              {renderItem(item, i)}
            </React.Fragment>
          ) : (
            renderItem(item, i)
          ),
        )}
        {scroll?.loading &&
          (scroll?.loader ?? (
            <Skeleton.Node count={10} gap={10} {...loaderProps} />
          ))}
        {scroll && <div ref={loaderRef} />}
      </div>
    </div>
  );
};

export default List;
