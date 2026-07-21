import { cn } from '@repo/ui/utils';

interface Props extends React.ComponentPropsWithoutRef<'span'> {
  variant?: 'default' | 'outlined';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const fillColorClasses: Record<string, string> = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-500/10 text-green-600 dark:text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  danger: 'bg-destructive/10 text-destructive',
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
    <span
      className={cn(
        'inline-flex items-center',
        'rounded-full px-2.5 py-1',
        'text-xs font-medium',
        variant === 'default' && fillColorClasses[color],
        variant === 'outlined' && ['border', outlinedColorClasses[color]],
        className,
        //
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Tag;
