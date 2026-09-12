'use client';

import * as React from 'react';

import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@repo/ui/utils';

/*
 * Vendored from shadcn's `new-york-v4` switch registry entry.
 *
 * Local patches — re-apply these after any `shadcn add switch`:
 * 1. Import `cn` from `@repo/ui/utils` (upstream uses its `cn` alias) and
 *    `SwitchPrimitive` from `@radix-ui/react-switch` (upstream uses the unified
 *    `radix-ui` package, which this repo doesn't install).
 * 2. `CustomProps` adds `handleClassName` (merged onto `SwitchPrimitive.Thumb`)
 *    and `children` (rendered inside the Root, after the Thumb).
 *
 * Why this stays a local patch rather than moving to `atoms/switch` (#361):
 * both reach *into* the primitive's sub-tree. `atoms/switch` is an antd-style
 * switch whose public `classNames.handle` is a runtime string that has to land
 * on the Thumb, and whose `checkedChildren`/`unCheckedChildren` labels render
 * inside the track (the Root) — neither is expressible through a verbatim
 * primitive + `className` composition, so this one is irreducibly structural
 * (like the four in #363). The rest of `shadcn add switch --diff` is class
 * ordering / prettier wrapping, not a patch.
 */
interface CustomProps {
  handleClassName?: string;
  children?: React.ReactNode;
}

function Switch({
  className,
  size = 'default',
  handleClassName,
  children,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
} & CustomProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        `peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input
        focus-visible:border-ring focus-visible:ring-ring/50
        dark:data-[state=unchecked]:bg-input/80 group/switch inline-flex
        shrink-0 items-center rounded-full border border-transparent shadow-xs
        transition-all outline-none focus-visible:ring-[3px]
        disabled:cursor-not-allowed disabled:opacity-50
        data-[size=default]:h-[1.15rem] data-[size=default]:w-8
        data-[size=sm]:h-3.5 data-[size=sm]:w-6`,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          `bg-background dark:data-[state=unchecked]:bg-foreground
          dark:data-[state=checked]:bg-primary-foreground pointer-events-none
          block rounded-full ring-0 transition-transform
          group-data-[size=default]/switch:size-4
          group-data-[size=sm]/switch:size-3
          data-[state=checked]:translate-x-[calc(100%-2px)]
          data-[state=unchecked]:translate-x-0`,
          handleClassName,
        )}
      />
      {children}
    </SwitchPrimitive.Root>
  );
}

export { Switch };
