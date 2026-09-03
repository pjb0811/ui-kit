'use client';

import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { INTERACTIVE_CHASSIS } from '../../lib/chassis';
import { type PresetColor } from '../../lib/colors';

type NativeSpanProps = React.ComponentProps<'span'> & {
  asChild?: boolean;
};

export interface Props extends Omit<NativeSpanProps, 'variant' | 'color'> {
  /**
   * Fill style, aligned with `Button`'s vocabulary (#320). The pre-7.0
   * `'default'` spelling was removed — use `'filled'`, which renders
   * identically.
   */
  variant?: 'filled' | 'outlined';
  /**
   * Colour. Every value — the semantic states (`primary`/`success`/`warning`/
   * `danger`) as well as the palette shared with `Button` (`blue`, `red`,
   * `gold`, …) — resolves through the same `data-color` + `--tag-*` system
   * (#320), so any of them can be re-themed the same way.
   *
   * `success`/`warning` have no `Button` counterpart on purpose: a Tag marks
   * state, which is why antd's Tag also carries them while its Button does not.
   */
  color?:
    'default' | 'primary' | 'success' | 'warning' | 'danger' | PresetColor;
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

// Every colour — semantic states and shared presets alike — resolves from the
// `--tag-*` custom properties that `globals.css` sets per `data-color` (#320).
// Before 7.0 only the presets took this path while the states carried bespoke
// Tailwind classes, which meant `[data-color]` hooks and `--tag-*` overrides
// worked on some colours but silently not on others.
//
//   --tag-bg    the hue; the border in `outlined`
//   --tag-fg    text colour (defaults to --tag-bg)
//   --tag-tint  the fill behind `filled` (defaults to a 10% --tag-bg wash)
const fillClasses = cn('border-transparent bg-(--tag-tint) text-(--tag-fg)');

const outlinedClasses = cn('border-(--tag-bg) text-(--tag-fg)');

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
  const resolvedVariant = variant ?? tagDefaults?.variant ?? 'filled';
  const resolvedColor = color ?? tagDefaults?.color ?? 'default';
  const isOutlined = resolvedVariant === 'outlined';
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      // Emitted for every colour, not just the presets, so consumers can hook
      // `[data-color]` / `[data-variant]` uniformly. `data-variant` is what
      // lets `globals.css` give `default` a different text colour when
      // outlined without reintroducing a second class path here.
      data-color={resolvedColor}
      data-variant={resolvedVariant}
      className={cn(
        TAG_BASE,
        'rounded-full px-2.5 py-1',
        'text-xs font-medium',
        isOutlined ? outlinedClasses : fillClasses,
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
