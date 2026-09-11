'use client';

import * as React from 'react';

import { Slottable } from '@radix-ui/react-slot';
import { LoaderCircle } from 'lucide-react';

import { useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { button } from '../../core';
import { type DeprecatedPresetColor, type PresetColor } from '../../lib/colors';

const Core = button.Button;

/**
 * shadcn's own `variant` words, accepted on top of this component's own
 * vocabulary rather than replacing it. They are sugar in exactly the sense
 * `type` is: each expands to a `(color, variant)` pair, so a snippet copied
 * from the shadcn docs renders as the nearest thing on this library's scale
 * instead of erroring.
 *
 * `link` is deliberately absent: it already exists as one of this component's
 * own variants and already renders what shadcn's `link` renders, so mapping it
 * would change `variant="link"`'s resolved colour from `default` to `primary`
 * for existing callers.
 */
type ShadcnVariant =
  'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';

/**
 * shadcn's `size` words. The `icon*` entries additionally force the icon-only
 * (square, unpadded) treatment, which this component otherwise infers from
 * `icon` being set with no children — without that, the shadcn idiom of
 * passing the icon as *children* (`<Button size="icon"><Trash /></Button>`)
 * would render a normal padded button.
 */
type ShadcnSize =
  'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';

export interface Props extends Omit<
  React.ComponentProps<typeof Core>,
  'size' | 'variant' | 'type'
> {
  icon?: React.ReactNode;
  block?: boolean;
  danger?: boolean;
  disabled?: boolean;
  /**
   * Size on this library's antd-style scale. shadcn's words are accepted too
   * and map onto that scale: `sm`/`xs` → `small`, `default` → `middle`,
   * `lg` → `large`. There is no separate `xs` step here, so `xs` renders as
   * `small`. The `icon*` entries pick the same sizes and additionally force
   * the icon-only treatment.
   */
  size?: 'small' | 'middle' | 'large' | ShadcnSize;
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
   *
   * shadcn's words are accepted here as well and expand to a `(color, variant)`
   * pair the same way `type` does — `destructive` ≡ `color="danger"
   * variant="solid"`, `outline` ≡ `outlined`, `secondary` ≡ `filled`,
   * `ghost` ≡ `text`, `default` ≡ `color="primary" variant="solid"`. An
   * explicit `color` still wins over the one the word implies.
   *
   * ⚠️ `variant="default"` (shadcn: a filled primary button) and
   * `type="default"` (antd: a plain outlined button) mean opposite things.
   * They are different props, so nothing collides at runtime, but don't read
   * one as the other.
   */
  variant?:
    | 'solid'
    | 'outlined'
    | 'dashed'
    | 'filled'
    | 'text'
    | 'link'
    | ShadcnVariant;
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
   *
   * Preset hues use Tailwind's colour names (#342). The pre-8.0 spellings
   * `magenta`/`geekblue`/`gold`/`volcano` still work and render unchanged, but
   * are deprecated — use `fuchsia`/`indigo`/`amber` instead (`volcano` has no
   * successor; it is `orange` one lightness step darker).
   */
  color?:
    PresetColor | DeprecatedPresetColor | 'default' | 'primary' | 'danger';
  loading?: boolean | { icon: React.ReactNode };
}

// Geometry, the focus/aria/disabled chassis and the svg sizing come from
// `core/button` again (#278 ③ is reversed here — see the core membership rule
// in CLAUDE.md). Unlike Tag, Button pins no core variant at all: it passes
// `variant={null} size={null}`, which cva treats as "skip this axis entirely",
// so the primitive contributes only its base string and the atom keeps full
// ownership of every colour and size class below. That leaves nothing for the
// `variant="…"` smell check to flag.
//
// The base still carries `rounded-md` and `text-sm`; the `rounded-*` from
// `shapesClasses` and the `text-*` from `sizesClasses` come later in the class
// list and override them, exactly as they did when this was absorbed.
const BUTTON_BASE = cn(
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

/** The half of `variant` that is this component's own vocabulary. */
type OwnVariant = Exclude<NonNullable<Props['variant']>, ShadcnVariant>;

type OwnSize = 'small' | 'middle' | 'large';

/**
 * shadcn's variant words → the `(color, variant)` pair each stands for here.
 * Same contract as `typeToColorVariant` above: the word only fills axes the
 * caller left unset, so an explicit `color` still wins over the implied one.
 */
const shadcnVariantToColorVariant: Record<
  ShadcnVariant,
  { color: NonNullable<Props['color']>; variant: OwnVariant }
> = {
  default: { color: 'primary', variant: 'solid' },
  destructive: { color: 'danger', variant: 'solid' },
  outline: { color: 'default', variant: 'outlined' },
  secondary: { color: 'default', variant: 'filled' },
  ghost: { color: 'default', variant: 'text' },
};

/** shadcn's size words → this library's scale. */
const shadcnSizeToSize: Record<ShadcnSize, OwnSize> = {
  default: 'middle',
  xs: 'small',
  sm: 'small',
  lg: 'large',
  icon: 'middle',
  'icon-xs': 'small',
  'icon-sm': 'small',
  'icon-lg': 'large',
};

/** The `size` words that also mean "render this icon-only". */
const ICON_SIZES = new Set<string>(['icon', 'icon-xs', 'icon-sm', 'icon-lg']);

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
  const resolvedShape = shape ?? buttonDefaults?.shape ?? 'default';
  // Both `variant` and `size` accept this library's own words *and* shadcn's.
  // Translate the shadcn ones first so everything below reasons in one
  // vocabulary; a word this library already owns (`link`, `text`, `small`, …)
  // is passed through untouched.
  const variantAlias =
    variant && variant in shadcnVariantToColorVariant
      ? shadcnVariantToColorVariant[variant as ShadcnVariant]
      : undefined;
  const ownVariant =
    variantAlias?.variant ?? (variant as OwnVariant | undefined);
  const ownSize =
    size && size in shadcnSizeToSize
      ? shadcnSizeToSize[size as ShadcnSize]
      : (size as OwnSize | undefined);
  const resolvedSize = ownSize ?? componentSize ?? 'middle';
  // A shadcn `size="icon*"` says "icon-only" explicitly; otherwise it is
  // inferred from an `icon` with no children, which is how this component has
  // always detected it.
  const iconOnly =
    (size != null && ICON_SIZES.has(size)) || !!(icon && !children);
  // `type` is syntactic sugar that expands to a (color, variant) pair; explicit
  // `color`/`variant` win over it, so `type` only fills the axes left unset.
  // A shadcn `variant` word carries an implied colour and sits between the two:
  // more specific than `type`, less than an explicit `color`.
  // A `Config` default sits below the call-site `type` (which is more specific)
  // but above the library built-in. `danger` still trumps everything, matching
  // antd. Defaults live here rather than on the parameters so `type` gets a
  // chance to supply them first.
  const typeDefaults = type ? typeToColorVariant[type] : undefined;
  const resolvedVariant =
    ownVariant ??
    typeDefaults?.variant ??
    buttonDefaults?.variant ??
    'outlined';
  const computedColor = danger
    ? 'danger'
    : (color ??
      variantAlias?.color ??
      typeDefaults?.color ??
      buttonDefaults?.color ??
      'default');
  const colored = computedColor !== 'default';
  const isLoading = !!loading;

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
    <Core
      // cva skips an axis entirely when it is passed `null`, so the primitive
      // contributes only its base string and this atom keeps ownership of
      // every colour/size class.
      variant={null}
      size={null}
      asChild={asChild}
      data-slot="button"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
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
      {/*
        A Button renders two children (the icon slot and the caller's content),
        but Radix's Slot accepts multiple children only when exactly one is
        marked `Slottable` — without this marker `asChild` threw
        "Slot failed to slot onto its children" for *every* call, icon or not.
        `Slottable` is a plain fragment when `asChild` is false, so the
        non-asChild markup is unchanged.
      */}
      <Slottable>{children}</Slottable>
    </Core>
  );
};

export default Button;
