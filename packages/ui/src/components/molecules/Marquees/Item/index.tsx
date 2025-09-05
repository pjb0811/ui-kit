import { useEffect, useRef, useState } from 'react';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

export interface ItemProps {
  key?: React.Key;
  speed?: number;
  autoFill?: boolean | number;
  pause?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
}

interface Props extends React.HTMLAttributes<HTMLDivElement>, ItemProps {
  width: string | number;
}

const Item = ({
  width: _width,
  speed = 100,
  autoFill = false,
  pause: _pause = false,
  pauseOnHover = false,
  children,
}: Props) => {
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const [width, setWidth] = useState<string | number>(_width);
  const [pause, setPause] = useState(false);
  const [repeatCount, setRepeatCount] = useState(
    autoFill ? (typeof autoFill === 'boolean' ? 100 : autoFill) : 0,
  );

  const isPaused = _pause || pause;

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
    if (!autoFill || !itemRefs.current[0] || typeof width === 'string') {
      return;
    }

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
  }, [autoFill, width]);

  useEffect(() => {
    setWidth(_width);
  }, [_width]);

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
    <div className="flex overflow-hidden" {...hoverEvents}>
      <div ref={containerRef} className="flex flex-nowrap">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            style={{ minWidth: width }}
            className="flex flex-nowrap"
          >
            <div
              ref={el => {
                if (el) {
                  itemRefs.current[index] = el;
                }
              }}
            >
              {children}
            </div>
            {[...Array(repeatCount)].map((_, i) => (
              <div key={i}>{children}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Item;
