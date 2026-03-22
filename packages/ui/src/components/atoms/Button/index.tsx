'use client';

import { LoaderCircle } from 'lucide-react';

import { button } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const Core = button.Button;
type ButtonProps = button.Props;

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

export interface Props extends Omit<ButtonProps, 'size' | 'variant' | 'type'> {
  icon?: React.ReactNode;
  block?: boolean;
  danger?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  type?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  variant?: 'solid' | 'outlined' | 'dashed' | 'filled' | 'text' | 'link';
  shape?: 'default' | 'circle' | 'round';
  color?: PresetColors | 'default' | 'primary' | 'danger';
  loading?: boolean | { icon: React.ReactNode };
}

const variantClasses: Record<string, string> = {
  solid: '',
  outlined: cn(
    'border border-[rgb(var(--btn-border)/0.5)]',
    'bg-background text-foreground',
    'hover:bg-accent',
  ),
  dashed: cn(
    'border border-dashed border-[rgb(var(--btn-border)/0.5)]',
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
  type = 'default',
  variant,
  size = 'middle',
  color = 'default',
  shape = 'default',
  block = false,
  disabled,
  loading,
  danger,
  children,
  onMouseDown,
  ...props
}: Props) => {
  const iconOnly = icon && !children;
  const computedColor = danger ? 'danger' : color;
  const colored = computedColor && computedColor !== 'default';
  const resolvedVariant = variant ?? typeToVariant[type] ?? 'solid';

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
      disabled={disabled}
      variant="default"
      data-color={computedColor}
      className={cn(
        'inline-flex items-center justify-center gap-x-2',
        'rounded-lg',
        'cursor-pointer',
        'h-auto py-0',
        'transition-all',
        variantClasses[resolvedVariant],
        sizesClasses[size || 'medium'],
        iconOnly && ['p-0', iconClasses[size || 'medium']],
        shapesClasses[shape || 'default'],
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
                'border-[rgb(var(--btn-border)/0.5)]',
                //
              ]),
        className,
        //
      )}
      onMouseDown={e => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      {...props}
    >
      {displayIcon}
      {children}
    </Core>
  );
};

export default Button;
