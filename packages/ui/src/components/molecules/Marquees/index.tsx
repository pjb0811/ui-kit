'use client';

import { useEffect, useState } from 'react';

import { useThrottle } from '@uidotdev/usehooks';
import { useElementSize } from 'use-hooks';

import { cn } from '@repo/ui/utils';

import Item, { type ItemProps } from './Item';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
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
  const [pause, setPause] = useState(false);

  const throttledWidth = useThrottle(width, 200);

  const { size } = useElementSize<HTMLDivElement>();

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
    if (!size.width) {
      return;
    }

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
          width: throttledWidth,
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
