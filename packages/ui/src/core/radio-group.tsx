'use client';

import * as React from 'react';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { CircleIcon } from 'lucide-react';

import { cn } from '@repo/ui/utils';

// Base UI primitives with repo-owned styling; no longer vendored from shadcn.
// Base UI splits Radix's `RadioGroup.Item` into a standalone `Radio.Root`
// (from `@base-ui/react/radio`) plus a `Radio.Indicator`.
//
// `Radio.Root` renders a `<span role="radio">`, where Radix rendered a
// `<button>`. That matters for centering: a button centers its content through
// the UA's own anonymous box, so the indicator — which collapses to zero height
// once its only child is taken out of flow — still landed on the centre line. A
// span gets no such treatment, so the same markup anchored the dot to the top
// of the control and it sat 7px high. The root therefore centers explicitly,
// matching `core/checkbox`, and the dot stays in flow rather than being
// absolutely positioned against a zero-height parent.
//
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
        dark:bg-input/30 inline-flex aspect-square size-4 shrink-0 items-center
        justify-center rounded-full border shadow-xs
        transition-[color,box-shadow] outline-none focus-visible:ring-[3px]
        data-disabled:cursor-not-allowed data-disabled:opacity-50`,
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <CircleIcon className="fill-primary size-2" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
