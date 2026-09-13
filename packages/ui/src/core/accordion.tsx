'use client';

import * as React from 'react';

import {
  Accordion as AccordionPrimitive,
  type AccordionRoot,
} from '@base-ui/react/accordion';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@repo/ui/utils';

/*
 * Base UI primitives with repo-owned styling; no longer vendored from shadcn.
 *
 * Notes on the Radix → Base UI shape change:
 * - Radix's `Accordion.Content` becomes Base UI's `Accordion.Panel`.
 * - `AccordionTrigger` keeps `expandIcon`, which *replaces* the default
 *   `ChevronDownIcon`. The open-state rotation targets Base UI's
 *   `data-panel-open` attribute on the trigger (Radix used `data-state=open`).
 * - The Radix-only `data-[state=…]:animate-accordion-*` classes are dropped:
 *   they targeted Radix's `data-state` and relied on keyframes this package
 *   never defined, so they were inert. Base UI mounts/unmounts the panel.
 */
// Base UI's accordion is generic over the item value; this library always
// addresses items by their stringified key (see molecules/collapse), so pin it
// to `string` — otherwise `React.ComponentProps` erases the generic to
// `unknown` and `value`/`onValueChange` stop lining up with the string callers.
function Accordion({ ...props }: AccordionRoot.Props<string>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  );
}

interface CustomTriggerProps {
  expandIcon?: React.ReactNode;
}

function AccordionTrigger({
  className,
  children,
  expandIcon,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> &
  CustomTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          `focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1
          items-start justify-between gap-4 rounded-md py-4 text-left text-sm
          font-medium transition-all outline-none hover:underline
          focus-visible:ring-[3px] data-disabled:pointer-events-none
          data-disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180`,
          className,
        )}
        {...props}
      >
        {children}
        {expandIcon || (
          <ChevronDownIcon
            className="text-muted-foreground pointer-events-none size-4 shrink-0
              translate-y-0.5 transition-transform duration-200"
          />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Panel>) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
