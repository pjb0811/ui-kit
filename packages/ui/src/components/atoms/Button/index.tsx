'use client';

import { LoaderCircle } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import {
  type Props as ButtonProps,
  Button as CoreButton,
} from '../../../core/button';

export interface Props extends ButtonProps {
  icon?: React.ReactNode;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean | { icon: React.ReactNode };
}

const variantClasses: Record<string, string> = {
  link: '',
  default: '',
  secondary: '',
  ghost: '',
  destructive: '',
  outline: '',
};

const Button = ({
  icon,
  className,
  variant = 'default',
  block = false,
  disabled,
  loading,
  children,
  onMouseDown,
  ...props
}: Props) => {
  return (
    <CoreButton
      variant={variant}
      disabled={disabled || !!loading}
      className={cn(
        variantClasses[variant || 'default'],
        block && 'w-full',
        icon && '',
        disabled && '',
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
