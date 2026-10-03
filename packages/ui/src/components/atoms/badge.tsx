import { cn } from '@repo/ui/utils';

type BadgeColor = 'primary' | 'success' | 'warning' | 'danger';

const colors: Record<BadgeColor, string> = {
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-green-600 text-white dark:bg-green-500',
  warning: 'bg-yellow-500 text-black',
  danger: 'bg-destructive text-white',
};

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'color'
> {
  /** Number shown in the indicator. Zero is hidden unless `showZero` is true. */
  count?: number;
  /** Show a small status dot instead of the count. */
  dot?: boolean;
  /** Highest number shown before displaying `maxCount+`. */
  maxCount?: number;
  showZero?: boolean;
  color?: BadgeColor;
  /** Pixel inset from the wrapped element's top and inline end edges. */
  offset?: readonly [number, number];
  /** Accessible name for the indicator, especially useful for a status dot. */
  indicatorLabel?: string;
  classNames?: {
    indicator?: string;
  };
}

const Badge = ({
  count,
  dot = false,
  maxCount = 99,
  showZero = false,
  color = 'danger',
  offset,
  indicatorLabel,
  className,
  classNames,
  children,
  ...props
}: Props) => {
  const hasChildren = children != null;
  const visible = dot || (count != null && (count !== 0 || showZero));
  const displayCount =
    count != null && count > maxCount ? `${maxCount}+` : count;

  if (!visible && !hasChildren) {
    return null;
  }

  return (
    <span
      {...props}
      data-slot="badge"
      className={cn('relative inline-flex w-fit align-middle', className)}
    >
      {children}
      {visible && (
        <span
          data-slot="badge-indicator"
          data-color={color}
          data-dot={dot || undefined}
          role={indicatorLabel ? 'img' : undefined}
          aria-label={indicatorLabel}
          aria-hidden={dot && !indicatorLabel ? true : undefined}
          className={cn(
            `pointer-events-none z-10 inline-flex shrink-0 items-center
            justify-center rounded-full font-medium whitespace-nowrap
            tabular-nums`,
            dot ? 'size-2' : 'min-h-5 min-w-5 px-1 text-xs',
            hasChildren &&
              `absolute end-0 top-0 translate-x-1/2 -translate-y-1/2
              rtl:-translate-x-1/2`,
            colors[color],
            classNames?.indicator,
            //
          )}
          style={
            hasChildren
              ? { top: offset?.[1] ?? 0, insetInlineEnd: offset?.[0] ?? 0 }
              : undefined
          }
        >
          {!dot && displayCount}
        </span>
      )}
    </span>
  );
};

export default Badge;
