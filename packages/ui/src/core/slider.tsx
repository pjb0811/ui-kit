'use client';

import * as React from 'react';

import { Slider as SliderPrimitive } from '@base-ui/react/slider';

import { cn } from '@repo/ui/utils';

type Props = Omit<
  SliderPrimitive.Root.Props<number[]>,
  'className' | 'render'
> & {
  className?: string;
};

// Base UI primitive with repo-owned styling; no longer vendored from shadcn.
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: Props) {
  const thumbs = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value;
    }
    if (Array.isArray(defaultValue)) {
      return defaultValue;
    }
    return [min, max];
  }, [value, defaultValue, min, max]);

  return (
    <SliderPrimitive.Root
      render={<span />}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        `relative flex w-full items-center data-[disabled]:cursor-not-allowed
        data-[disabled]:opacity-50 data-[orientation=vertical]:h-full
        data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto
        data-[orientation=vertical]:flex-col`,
        className,
        //
      )}
      {...props}
    >
      <SliderPrimitive.Control
        className={cn(
          `relative flex w-full touch-none items-center select-none
          data-[orientation=vertical]:h-full
          data-[orientation=vertical]:min-h-44
          data-[orientation=vertical]:w-auto
          data-[orientation=vertical]:flex-col`,
        )}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            `bg-input relative grow overflow-hidden rounded-full
            data-[orientation=horizontal]:h-1.5
            data-[orientation=horizontal]:w-full
            data-[orientation=vertical]:h-full
            data-[orientation=vertical]:w-1.5`,
          )}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className={cn(
              `bg-primary data-[orientation=horizontal]:h-full
              data-[orientation=vertical]:w-full`,
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbs.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            className={cn(
              `border-primary bg-background ring-ring/50 block size-4 shrink-0
              rounded-full border shadow-sm transition-[color,box-shadow]
              hover:ring-4 has-[:focus-visible]:ring-4
              has-[:focus-visible]:outline-hidden
              data-disabled:pointer-events-none data-disabled:opacity-50`,
            )}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
