'use client';

import * as React from 'react';

import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@repo/ui/utils';

/*
 * Vendored from shadcn's `new-york-v4` progress registry entry.
 *
 * Local patches — re-apply these after any `shadcn add progress`:
 * 1. Import `cn` from `@repo/ui/utils` (upstream uses its `cn` alias) and
 *    `ProgressPrimitive` from `@radix-ui/react-progress` (upstream uses the
 *    unified `radix-ui` package, which this repo doesn't install).
 * 2. `CustomProps` adds `barClassName` (merged onto the Indicator's className)
 *    and `barStyle` (merged into the Indicator's inline `style`).
 *
 * Why this stays a local patch rather than moving to `atoms/progress` (#361):
 * `atoms/progress` supports a vertical direction, which needs the Indicator
 * sized by `height %` via `barStyle` — overriding upstream's inline
 * `transform: translateX(...)`. Inline style can't be overridden through a
 * `className`, so the consumer must reach the Indicator's `style`, which a
 * verbatim primitive doesn't expose. Irreducibly structural (like #363). The
 * rest of `shadcn add progress --diff` is class ordering / prettier wrapping.
 */
interface CustomProps {
  barClassName?: string;
  barStyle?: React.CSSProperties;
}

function Progress({
  className,
  value,
  barClassName,
  barStyle,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & CustomProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'bg-primary h-full w-full flex-1 transition-all',
          barClassName,
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          ...barStyle,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
