'use client';

import * as React from 'react';

import { Progress as ProgressPrimitive } from '@base-ui/react/progress';

import { cn } from '@repo/ui/utils';

interface CustomProps {
  barClassName?: string;
  barStyle?: React.CSSProperties;
}

// Base UI primitive with repo-owned styling; no longer vendored from shadcn.
function Progress({
  className,
  barClassName,
  barStyle,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & CustomProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          'h-full w-full flex-1 bg-primary transition-all',
          barClassName,
          //
        )}
        style={barStyle}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
