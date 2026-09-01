'use client';

import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { LoaderCircle } from 'lucide-react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { INTERACTIVE_CHASSIS } from '../../lib/chassis';

type NativeButtonProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
};

type PresetColors =
  | 'blue'
  | 'purple'
  | 'cyan'
  | 'green'
  | 'magenta'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'volcano'
  | 'geekblue'
  | 'lime'
  | 'gold';

export interface Props extends Omit<
  NativeButtonProps,
  'size' | 'variant' | 'type'
> {
  icon?: React.ReactNode;
  block?: boolean;
  danger?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  /**
   * Syntactic sugar for a `(color, variant)` pair. **Will follow `variant` and
   * `color` if provided** — `type` only fills in the axes you leave unset.
   *
   * | `type`    | equivalent to                          |
   * | --------- | -------------------------------------- |
   * | `primary` | `color="primary" variant="solid"`      |
   * | `default` | `color="default" variant="outlined"`   |
   * | `dashed`  | `color="default" variant="dashed"`     |
   * | `text`    | `color="default" variant="text"`       |
   * | `link`    | `color="primary" variant="link"`       |
   *
   * So `<Button type="primary">` is the same as
   * `<Button color="primary" variant="solid">`, and
   * `<Button type="primary" variant="filled">` keeps the primary color but
   * renders filled. `danger` still overrides the resolved color.
   */
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  /**
   * Visual fill style, independent of `color`. Defaults to `'outlined'`.
   * Takes precedence over whatever `type` would have supplied.
   */
  variant?: 'solid' | 'outlined' | 'dashed' | 'filled' | 'text' | 'link';
  /**
   * Native `<button>` `type` (`button`/`submit`/`reset`), kept separate
   * from the antd-style `type` above. Defaults to `'button'` so a Button
   * placed inside a `<form>` doesn't submit it unless explicitly opted in.
   */
  htmlType?: 'button' | 'submit' | 'reset';
  shape?: 'default' | 'circle' | 'round';
  /**
   * Color, independent of `variant`. Defaults to `'default'`, or to whatever
   * `type` maps to when `type` is set. `danger` overrides this.
   */
  color?: PresetColors | 'default' | 'primary' | 'danger';
  loading?: boolean | { icon: React.ReactNode };
}

// Chassis absorbed from core/button's cva base (#278 ③ / #294 Phase 4). The
// shared focus/aria set lives in INTERACTIVE_CHASSIS; a Button additionally
// disables and sizes its icons. Kept as constants so the absorb relocates this
// treatment rather than dropping it (the #177 class of silent regression the
// #300/#301 net guards).
const BUTTON_CHASSIS = cn(
  INTERACTIVE_CHASSIS,
  'outline-none',
  'disabled:pointer-events-none disabled:opacity-50',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
);

// Presentation the atom builds on. The size/variant/shape classes below still
// override the incidental leftovers exactly as they did when this wrapped
// core/button, so the rendered output is unchanged (verified against a
// pre-refactor render matrix).
const BUTTON_BASE = cn(
  BUTTON_CHASSIS,
  'gap-2 whitespace-nowrap font-medium transition-all',
  'has-[>svg]:px-3',
);

const variantClasses: Record<string, string> = {
  // solid used to inherit its fill from core/button's default variant; carry it
  // explicitly now that the primitive is absorbed. A colored solid overrides
  // this with the --btn-* custom properties further down.
  solid: cn('bg-primary text-primary-foreground', 'hover:bg-primary/90'),
  outlined: cn(
    'border border-[color-mix(in_oklch,var(--btn-border),transparent_50%)]',
    'bg-background text-foreground',
    'hover:bg-accent',
  ),
  dashed: cn(
    'border border-dashed border-[color-mix(in_oklch,var(--btn-border),transparent_50%)]',
    'bg-background text-foreground',
    'hover:bg-accent',
  ),
  filled: cn('bg-muted text-foreground', 'hover:bg-muted/80'),
  text: cn('bg-transparent text-foreground', 'hover:bg-accent'),
  link: cn(
    'bg-transparent text-primary',
    'underline-offset-4 hover:underline',
    'hover:bg-primary/10',
  ),
};

/**
 * antd-style syntactic sugar: each `type` expands to a `(color, variant)` pair.
 * Explicit `color`/`variant` props win over whatever the `type` maps to, so
 * `type` only fills in the axes the caller left unset.
 *
 * Mirrors antd: `<Button type="primary">` ≡ `<Button color="primary" variant="solid">`.
 */
const typeToColorVariant: Record<
  NonNullable<Props['type']>,
  { color: NonNullable<Props['color']>; variant: NonNullable<Props['variant']> }
> = {
  primary: { color: 'primary', variant: 'solid' },
  default: { color: 'default', variant: 'outlined' },
  dashed: { color: 'default', variant: 'dashed' },
  text: { color: 'default', variant: 'text' },
  link: { color: 'primary', variant: 'link' },
};

const sizesClasses: Record<string, string> = {
  small: 'h-6 px-3 text-sm',
  middle: 'h-8 px-4 text-base',
  large: 'h-10 px-5 text-lg',
};

const iconClasses: Record<string, string> = {
  small: `size-6 [&_svg:not([class*='size-'])]:size-3`,
  middle: `size-8 [&_svg:not([class*='size-'])]:size-4`,
  large: `size-10 [&_svg:not([class*='size-'])]:size-5`,
};

const shapesClasses = {
  default: 'rounded-sm',
  circle: 'rounded-full',
  round: 'rounded-2xl',
};

const Button = ({
  icon,
  className,
  type,
  variant,
  htmlType = 'button',
  size,
  color,
  shape,
  block = false,
  disabled,
  loading,
  danger,
  asChild = false,
  children,
  onMouseDown,
  ...props
}: Props) => {
  const { componentSize, defaultProps } = useConfig();
  const buttonDefaults = defaultProps?.button as
    Partial<Pick<Props, 'shape' | 'variant' | 'color'>> | undefined;
  const resolvedSize = size ?? componentSize ?? 'middle';
  const resolvedShape = shape ?? buttonDefaults?.shape ?? 'default';
  const iconOnly = icon && !children;
  // `type` is syntactic sugar that expands to a (color, variant) pair; explicit
  // `color`/`variant` win over it, so `type` only fills the axes left unset.
  // A `Config` default sits below the call-site `type` (which is more specific)
  // but above the library built-in. `danger` still trumps everything, matching
  // antd. Defaults live here rather than on the parameters so `type` gets a
  // chance to supply them first.
  const typeDefaults = type ? typeToColorVariant[type] : undefined;
  const resolvedVariant =
    variant ?? typeDefaults?.variant ?? buttonDefaults?.variant ?? 'outlined';
  const computedColor = danger
    ? 'danger'
    : (color ?? typeDefaults?.color ?? buttonDefaults?.color ?? 'default');
  const colored = computedColor !== 'default';
  const isLoading = !!loading;

  const Comp = asChild ? Slot : 'button';

  const displayIcon = loading ? (
    typeof loading === 'object' ? (
      loading.icon
    ) : (
      <LoaderCircle className="animate-spin" />
    )
  ) : (
    icon
  );

  return (
    <Comp
      data-slot="button"
      className={cn(
        BUTTON_BASE,
        'inline-flex items-center justify-center gap-x-2',
        'rounded-lg',
        'cursor-pointer',
        'h-auto py-0',
        'transition-all',
        variantClasses[resolvedVariant],
        sizesClasses[resolvedSize],
        iconOnly && ['p-0', iconClasses[resolvedSize]],
        shapesClasses[resolvedShape],
        block && 'w-full',
        colored &&
          (resolvedVariant === 'solid'
            ? [
                'bg-(--btn-bg)',
                'hover:bg-(--btn-bg-hover)',
                'active:bg-(--btn-bg-active)',
                'text-(--btn-fg)',
                'border-(--btn-border)',
              ]
            : [
                'text-(--btn-bg)',
                'border-[color-mix(in_oklch,var(--btn-border),transparent_50%)]',
                //
              ]),
        className,
        //
      )}
      type={htmlType}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      data-color={computedColor}
      onMouseDown={e => {
        onMouseDown?.(e);
      }}
      {...props}
    >
      {displayIcon}
      {children}
    </Comp>
  );
};

export default Button;
