'use client';

import * as React from 'react';

import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';

import { cn } from '@repo/ui/utils';

interface Props extends Omit<
  React.ComponentProps<typeof SeparatorPrimitive>,
  'className'
> {
  className?: string;
  decorative?: boolean;
}

// Base UI primitive with repo-owned styling; no longer vendored from shadcn.
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        `bg-border shrink-0 data-[orientation=horizontal]:h-px
        data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full
        data-[orientation=vertical]:w-px`,
        className,
        //
      )}
      {...props}
    />
  );
}

export { Separator };
