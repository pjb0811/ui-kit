'use client';

import { useEffect, useRef, useState } from 'react';

import {
  useMergedRef,
  useResponsiveSize,
  useThrottledValue,
} from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import Item, { type ItemProps } from './item';
import usePauseOnHover from './use-pause-on-hover';

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
  // The container's own width, not the viewport's. `useResponsiveSize`
  // measures in a layout effect, but this component copies the result into
  // state in a passive effect and then throttles it, so the seed is what
  // paints for the first ~200ms. `100vw` overflowed every padded or columned
  // layout for that window — on the docs page it drew the track 1280px wide
  // inside a 703px column, briefly showing the whole track and giving the
  // page a horizontal scrollbar. `100%` resolves to the same value the
  // measurement lands on, so there is nothing left to snap.
  const [width, setWidth] = useState<string | number>(
    '100%',
    //
  );
  const [padding, setPadding] = useState(0);
  const { pause, hoverEvents } = usePauseOnHover(pauseOnHover);

  const throttledWidth = useThrottledValue(width, 200);

  const { size, ref: responsiveRef } = useResponsiveSize<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const setContainerRef = useMergedRef(containerRef, responsiveRef);

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

  return (
    <div
      ref={setContainerRef}
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

export default Marquees;
