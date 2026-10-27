'use client';

import * as React from 'react';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon, MinusIcon } from 'lucide-react';

import { cn } from '@repo/ui/utils';

// Base UI primitive with repo-owned styling; no longer vendored from shadcn.
function Checkbox({
  className,
  indeterminate,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `peer inline-flex size-4 shrink-0 items-center justify-center
        rounded-[4px] border border-input shadow-xs transition-shadow
        outline-none focus-visible:border-ring focus-visible:ring-[3px]
        focus-visible:ring-ring/50 aria-invalid:border-destructive
        aria-invalid:ring-destructive/20 data-checked:border-primary
        data-checked:bg-primary data-checked:text-primary-foreground
        data-disabled:cursor-not-allowed data-disabled:opacity-50
        data-indeterminate:border-primary data-indeterminate:bg-primary
        data-indeterminate:text-primary-foreground dark:bg-input/30
        dark:aria-invalid:ring-destructive/40 dark:data-checked:bg-primary`,
        className,
        //
      )}
      {...props}
      indeterminate={indeterminate}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        {indeterminate ? (
          <MinusIcon className="size-3.5" />
        ) : (
          <CheckIcon className="size-3.5" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
