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

export interface Props extends Omit<ButtonProps, 'size' | 'variant'> {
  icon?: React.ReactNode;
  block?: boolean;
  danger?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'solid' | 'outlined' | 'dashed' | 'filled' | 'text' | 'link';
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

const sizesClasses: Record<string, string> = {
  small: 'h-6 px-3 text-sm',
  medium: 'h-8 px-4 text-base',
  large: 'h-10 px-5 text-lg',
};

const iconSizes: Record<string, string> = {
  small: 'size-6',
  medium: 'size-8',
  large: 'size-10',
};

const Button = ({
  icon,
  className,
  variant = 'solid',
  size = 'medium',
  color = 'default',
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
        variantClasses[variant || 'solid'],
        sizesClasses[size || 'medium'],
        iconOnly && iconSizes[size || 'medium'],
        block && 'w-full',
        colored &&
          (variant === 'solid'
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
