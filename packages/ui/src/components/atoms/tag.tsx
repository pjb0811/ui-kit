'use client';

import * as React from 'react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { badge } from '../../core';
import { type PresetColor } from '../../lib/colors';

const Core = badge.Badge;

export interface Props extends Omit<
  React.ComponentProps<typeof Core>,
  'variant' | 'color'
> {
  /**
   * Fill style, aligned with `Button`'s vocabulary (#320). The pre-7.0
   * `'default'` spelling was removed — use `'filled'`, which renders
   * identically.
   */
  variant?: 'filled' | 'outlined';
  /**
   * Colour. Every value — the semantic states (`primary`/`success`/`warning`/
   * `danger`) as well as the palette shared with `Button` (`blue`, `red`,
   * `amber`, …) — resolves through the same `data-color` + `--tag-*` system
   * (#320), so any of them can be re-themed the same way.
   *
   * `success`/`warning` have no `Button` counterpart on purpose: a Tag marks
   * state, which is why antd's Tag also carries them while its Button does not.
   *
   * Preset hues use Tailwind's colour names (#342).
   */
  color?:
    'default' | 'primary' | 'success' | 'warning' | 'danger' | PresetColor;
}

// Geometry, the focus/aria chassis and the svg sizing all come from
// `core/badge` now (#278 ③ is reversed here — see the core membership rule in
// CLAUDE.md). Tag pins the core `outline` variant because it supplies exactly
// the neutral base Tag wants — a border plus `text-foreground` and the `[a&]`
// hover treatment — and then repaints border/text/fill from the `--tag-*`
// custom properties below. Pinning one core variant is deliberate and is why
// the membership rule had to change; the alternative (absorbing the primitive)
// is what left `core/badge` orphaned and three upstream releases stale.
const CORE_VARIANT = 'outline';

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

const Tag = ({ className, variant, color, children, ...props }: Props) => {
  const { defaultProps } = useConfig();
  const tagDefaults = defaultProps?.tag as
    Partial<Pick<Props, 'variant' | 'color'>> | undefined;
  // An explicit prop wins over a `Config` default, which wins over the built-in
  // — the same resolution order `Button` uses.
  const resolvedVariant = variant ?? tagDefaults?.variant ?? 'filled';
  const resolvedColor = color ?? tagDefaults?.color ?? 'default';
  const isOutlined = resolvedVariant === 'outlined';

  return (
    <Core
      variant={CORE_VARIANT}
      // Overrides the core primitive's own `data-slot="badge"`. The slot now
      // matches the public component name, which frees `badge` for the
      // antd-style Badge (a count/dot decorator, a different component from
      // this chip — shadcn's Badge is what antd calls a Tag).
      data-slot="tag"
      // Emitted for every colour, not just the presets, so consumers can hook
      // `[data-color]` / `[data-variant]` uniformly. `data-variant` is what
      // lets `globals.css` give `default` a different text colour when
      // outlined without reintroducing a second class path here; it also
      // replaces the core primitive's own `data-variant`, which would
      // otherwise report the pinned core variant rather than Tag's.
      data-color={resolvedColor}
      data-variant={resolvedVariant}
      className={cn(
        'rounded-full px-2.5 py-1',
        isOutlined ? outlinedClasses : fillClasses,
        className,
        //
      )}
      {...props}
    >
      {children}
    </Core>
  );
};

export default Tag;
