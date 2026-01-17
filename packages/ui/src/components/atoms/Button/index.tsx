'use client';

import { LoaderCircle } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import {
  type Props as ButtonProps,
  Button as CoreButton,
} from '../../../core/button';

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

export interface Props extends Omit<ButtonProps, 'size'> {
  icon?: React.ReactNode;
  block?: boolean;
  danger?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: PresetColors | 'default' | 'primary' | 'danger';
  loading?: boolean | { icon: React.ReactNode };
}

const variantClasses: Record<string, string> = {
  default: '',
  secondary: '',
  ghost: '',
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
  variant = 'default',
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

  return (
    <CoreButton
      variant={variant}
      disabled={disabled}
      data-color={colored ? computedColor : undefined}
      className={cn(
        variantClasses[variant || 'default'],
        'inline-flex items-center justify-center gap-x-2',
        'rounded-lg',
        'cursor-pointer',
        'h-auto py-0',
        sizesClasses[size || 'medium'],
        iconOnly && iconSizes[size || 'medium'],
        block && 'w-full',
        colored && [
          'bg-(--btn-bg)',
          'hover:bg-(--btn-bg-hover)',
          'active:bg-(--btn-bg-active)',
          'text-(--btn-fg)',
        ],
        className,
        //
      )}
      onMouseDown={e => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      {...props}
    >
      {loading ? (
        typeof loading === 'object' ? (
          loading.icon
        ) : (
          <LoaderCircle className="animate-spin" />
        )
      ) : (
        icon
      )}
      {children}
    </CoreButton>
  );
};

export default Button;
