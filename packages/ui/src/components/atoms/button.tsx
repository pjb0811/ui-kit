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
   * @deprecated Use `variant` instead. `type` is an alias kept for backwards
   * compatibility and will be removed in the next major.
   *
   * The two props address the same axis, and 3 of the 5 values (`dashed`,
   * `text`, `link`) are already spelled identically — `<Button type="text">`
   * and `<Button variant="text">` render the same thing. The only values
   * `type` contributes are the aliases `primary` → `solid` and
   * `default` → `outlined`. `variant` additionally offers `filled`, which
   * `type` cannot express.
   *
   * Migration:
   * | `type`    | `variant`   |
   * | --------- | ----------- |
   * | `primary` | `solid`     |
   * | `default` | `outlined`  |
   * | `dashed`  | `dashed`    |
   * | `text`    | `text`      |
   * | `link`    | `link`      |
   *
   * Passing both still lets `variant` win.
   */
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  /**
   * Visual fill style. This is the canonical prop — prefer it over `type`.
   * Defaults to `'outlined'` (matching the legacy `type="default"`).
   */
  variant?: 'solid' | 'outlined' | 'dashed' | 'filled' | 'text' | 'link';
  /**
   * Native `<button>` `type` (`button`/`submit`/`reset`), kept separate
   * from the antd-style `type` above. Defaults to `'button'` so a Button
   * placed inside a `<form>` doesn't submit it unless explicitly opted in.
   */
  htmlType?: 'button' | 'submit' | 'reset';
  shape?: 'default' | 'circle' | 'round';
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

const typeToVariant: Record<string, string> = {
  primary: 'solid',
  default: 'outlined',
  dashed: 'dashed',
  text: 'text',
  link: 'link',
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
  color = 'default',
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
    Partial<Pick<Props, 'shape'>> | undefined;
  const resolvedSize = size ?? componentSize ?? 'middle';
  const resolvedShape = shape ?? buttonDefaults?.shape ?? 'default';
  const iconOnly = icon && !children;
  const computedColor = danger ? 'danger' : color;
  const colored = computedColor && computedColor !== 'default';
  // `variant` is canonical; `type` is a deprecated alias resolved through
  // typeToVariant. The default lives here (not on the `type` parameter) so the
  // deprecated prop stays off the default path — a Button with neither prop
  // resolves straight to 'outlined'.
  const resolvedVariant =
    variant ?? (type ? typeToVariant[type] : undefined) ?? 'outlined';
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
