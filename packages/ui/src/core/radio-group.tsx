'use client';

import * as React from 'react';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { CircleIcon } from 'lucide-react';

import { cn } from '@repo/ui/utils';

// Base UI primitives with repo-owned styling; no longer vendored from shadcn.
// Base UI splits Radix's `RadioGroup.Item` into a standalone `Radio.Root`
// (from `@base-ui/react/radio`) plus a `Radio.Indicator`.
// Base UI's `RadioGroup` is generic over the item value; this library always
// addresses items by their stringified value (see atoms/radio), so pin it to
// `string` — otherwise `React.ComponentProps` erases the generic to `unknown`
// and `value`/`onValueChange` stop lining up with the string callers.
function RadioGroup({
  className,
  ...props
}: RadioGroupPrimitive.Props<string>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioPrimitive.Root>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        `border-input text-primary focus-visible:border-ring
        focus-visible:ring-ring/50 aria-invalid:ring-destructive/20
        dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
        dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border
        shadow-xs transition-[color,box-shadow] outline-none
        focus-visible:ring-[3px] data-disabled:cursor-not-allowed
        data-disabled:opacity-50`,
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon
          className="fill-primary absolute top-1/2 left-1/2 size-2
            -translate-x-1/2 -translate-y-1/2"
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
