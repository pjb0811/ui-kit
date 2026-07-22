import { badge } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const Core = badge.Badge;
type BadgeProps = badge.Props;

export interface Props extends Omit<BadgeProps, 'variant'> {
  variant?: 'default' | 'outlined';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

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
  variant = 'default',
  color = 'default',
  children,
  ...props
}: Props) => {
  return (
    <Core
      variant="outline"
      className={cn(
        'rounded-full px-2.5 py-1',
        'text-xs font-medium',
        variant === 'default' && fillColorClasses[color],
        variant === 'outlined' && outlinedColorClasses[color],
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
