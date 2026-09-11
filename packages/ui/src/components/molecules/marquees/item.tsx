'use client';

import { useEffect, useRef, useState } from 'react';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import usePauseOnHover from './use-pause-on-hover';

export interface ItemProps {
  key?: React.Key;
  speed?: number;
  autoFill?: boolean | number;
  pause?: boolean;
  pauseOnHover?: boolean;
  gap?: number;
  children?: React.ReactNode;
}

export interface Props
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'key'>, ItemProps {
  width: string | number;
}

// `autoFill={true}` (the default on `Marquees`) needs *some* repeat count
// before the item can be measured and the real count computed — this is
// only ever visible for that one render, but rendering 100 copies (200
// with the 2x loop duplication) up front was needlessly heavy for the
// common case. A modest guess still avoids visible gaps for typical
// item/container width ratios while cutting the worst-case default
// render by ~90%.
const INITIAL_AUTO_FILL_GUESS = 10;

const resolveInitialRepeatCount = (autoFill: boolean | number) => {
  if (!autoFill) {
    return 0;
  }

  return typeof autoFill === 'boolean' ? INITIAL_AUTO_FILL_GUESS : autoFill;
};

const Item = ({
  width: _width,
  speed = 100,
  autoFill = false,
  pause: _pause = false,
  pauseOnHover = false,
  gap = 0,
  children,
}: Props) => {
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const [width, setWidth] = useState<string | number>(_width);
  const { pause, hoverEvents } = usePauseOnHover(pauseOnHover);
  const [repeatCount, setRepeatCount] = useState(
    resolveInitialRepeatCount(autoFill),
  );
  const [prevWidthProp, setPrevWidthProp] = useState(_width);
  const [prevAutoFill, setPrevAutoFill] = useState(autoFill);
  const [prevGap, setPrevGap] = useState(gap);

  // Adjusted directly in render (React's "adjust state during render"
  // pattern) instead of an effect, so `width`/`repeatCount` re-sync with
  // the prop in the same render it changes rather than the render after.
  if (_width !== prevWidthProp) {
    setPrevWidthProp(_width);
    setWidth(_width);
  }

  if (autoFill !== prevAutoFill) {
    setPrevAutoFill(autoFill);
    setRepeatCount(resolveInitialRepeatCount(autoFill));
  }

  // `gap` widens every copy, so both the measured item width and the repeat
  // count derived from it are stale. Rewind `width` to the container width
  // so the measuring effect below recomputes the loop distance from scratch.
  if (gap !== prevGap) {
    setPrevGap(gap);
    setWidth(_width);
    setRepeatCount(resolveInitialRepeatCount(autoFill));
  }

  const isPaused = _pause || pause;

  useEffect(() => {
    if (
      !autoFill ||
      !children ||
      !itemRefs.current[0] ||
      typeof width === 'string'
    ) {
      return;
    }

    // `offsetWidth` is the border-box width, so it already includes the
    // `gap` padding each copy carries — the loop distance stays exact
    // without adding `gap` back in here.
    const itemWidth = itemRefs.current[0].offsetWidth;

    if (itemWidth >= width) {
      setWidth(itemWidth);
      setRepeatCount(0);
      return;
    }

    let totalWidth = 0;
    let repeatCount = 0;

    while (totalWidth < width) {
      totalWidth += itemWidth;
      repeatCount += 1;
    }

    setWidth(totalWidth);
    setRepeatCount(repeatCount - 1);
  }, [autoFill, width, children, gap]);

  useGSAP(
    () => {
      if (!containerRef.current || typeof width === 'string') {
        return;
      }

      if (tweenRef.current) {
        tweenRef.current.kill();
      }

      tweenRef.current = gsap.fromTo(
        containerRef.current,
        { x: 0 },
        {
          x: -width,
          duration: width / speed,
          repeat: -1,
          ease: 'linear',
        },
      );

      return () => {
        tweenRef.current?.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [width, speed],
    },
  );

  useEffect(() => {
    if (!tweenRef.current) {
      return;
    }

    if (isPaused) {
      tweenRef.current.pause();
    } else {
      tweenRef.current.play();
    }
  }, [isPaused]);

  return (
    <div
      className="flex overflow-hidden"
      {...hoverEvents}
      //
    >
      <div ref={containerRef} className="flex flex-nowrap">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            style={{ minWidth: width }}
            className="flex flex-nowrap"
          >
            {/* Every copy carries the same trailing `gap`, so the spacing is
                uniform at the seam between copies and between the two loop
                halves — no special-casing at either boundary. */}
            <div
              ref={el => {
                if (el) {
                  itemRefs.current[index] = el;
                }
              }}
              style={{ paddingRight: gap }}
            >
              {children}
            </div>
            {[
              ...Array(typeof autoFill === 'number' ? autoFill : repeatCount),
            ].map((_, i) => (
              <div key={i} style={{ paddingRight: gap }}>
                {children}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Item;
