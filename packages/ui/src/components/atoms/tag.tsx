'use client';

import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { INTERACTIVE_CHASSIS } from '../../lib/chassis';

type NativeSpanProps = React.ComponentProps<'span'> & {
  asChild?: boolean;
};

export interface Props extends Omit<NativeSpanProps, 'variant'> {
  variant?: 'default' | 'outlined';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

// Base absorbed from core/badge's cva base + its `outline` variant, which Tag
// always rendered as (#278 ③ / #294 Phase 4). The shared focus/aria/centering
// set lives in INTERACTIVE_CHASSIS; a Tag adds badge geometry and its svg
// sizing but — unlike Button — no `disabled:*` (a Tag is not disableable). The
// rounded/padding leftovers are overridden by the atom classes below exactly as
// before, so the rendered output is unchanged (verified against a pre-refactor
// render matrix).
const TAG_BASE = cn(
  INTERACTIVE_CHASSIS,
  'border w-fit whitespace-nowrap overflow-hidden',
  'text-xs font-medium gap-1 transition-[color,box-shadow]',
  '[&>svg]:size-3 [&>svg]:pointer-events-none',
  'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
);

const fillColorClasses: Record<string, string> = {
  default: 'border-transparent bg-muted text-muted-foreground',
  primary: 'border-transparent bg-primary/10 text-primary',
  success:
    'border-transparent bg-green-500/10 text-green-600 dark:text-green-400',
  warning:
    'border-transparent bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  danger: 'border-transparent bg-destructive/10 text-destructive',
};

const outlinedColorClasses: Record<string, string> = {
  default: 'border-border text-foreground',
  primary: 'border-primary text-primary',
  success: 'border-green-500 text-green-600 dark:text-green-400',
  warning: 'border-yellow-500 text-yellow-600 dark:text-yellow-400',
  danger: 'border-destructive text-destructive',
};

const Tag = ({
  className,
  variant,
  color,
  asChild = false,
  children,
  ...props
}: Props) => {
  const { defaultProps } = useConfig();
  const tagDefaults = defaultProps?.tag as
    Partial<Pick<Props, 'variant' | 'color'>> | undefined;
  // An explicit prop wins over a `Config` default, which wins over the built-in
  // — the same resolution order `Button` uses.
  const resolvedVariant = variant ?? tagDefaults?.variant ?? 'default';
  const resolvedColor = color ?? tagDefaults?.color ?? 'default';
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(
        TAG_BASE,
        'rounded-full px-2.5 py-1',
        'text-xs font-medium',
        resolvedVariant === 'default' && fillColorClasses[resolvedColor],
        resolvedVariant === 'outlined' && outlinedColorClasses[resolvedColor],
        className,
        //
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default Tag;
