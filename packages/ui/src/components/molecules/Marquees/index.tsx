'use client';

import { useEffect, useRef, useState } from 'react';

import { useResponsiveSize, useThrottle } from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import Item, { type ItemProps } from './Item';

export interface Props extends React.ComponentPropsWithoutRef<'div'> {
  speed?: number;
  autoFill?: boolean | number;
  pauseOnHover?: boolean;
  items?: ItemProps[];
}

const Marquees = ({
  className,
  items,
  speed,
  pauseOnHover = true,
  autoFill = true,
  ...props
}: Props) => {
  const [width, setWidth] = useState<string | number>(
    '100vw',
    //
  );
  const [padding, setPadding] = useState(0);
  const [pause, setPause] = useState(false);

  const throttledWidth = useThrottle(width, 200);

  const { size } = useResponsiveSize<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverEvents = pauseOnHover
    ? {
        onMouseEnter: () => {
          setPause(true);
        },
        onMouseLeave: () => {
          setPause(false);
        },
      }
    : {};

  useEffect(() => {
    if (!size.width || !containerRef.current) {
      return;
    }

    const computedStyle = getComputedStyle(containerRef.current);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;

    setPadding(paddingLeft + paddingRight);

    setWidth(size.width);
  }, [size]);

  useEffect(() => {
    const onScroll = () => {
      setWidth(document.body.scrollWidth);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        className,
        //
      )}
      {...hoverEvents}
      {...props}
    >
      <div
        className={cn(
          'flex flex-col gap-y-5',
          'overflow-hidden',
          'whitespace-nowrap',
          'bg-inherit',
          //
        )}
        style={{
          width:
            typeof throttledWidth === 'number'
              ? throttledWidth - padding
              : throttledWidth,
        }}
      >
        {items?.map(({ children, key: itemKey, ...item }: ItemProps, key) => (
          <Item
            key={itemKey || key}
            width={throttledWidth}
            pause={pause}
            speed={speed}
            autoFill={autoFill}
            {...item}
          >
            {children}
          </Item>
        ))}
      </div>
    </div>
  );
};

Marquees.Item = Item;

export { Item, type ItemProps, type Props as MarqueesProps };

export default Marquees;
