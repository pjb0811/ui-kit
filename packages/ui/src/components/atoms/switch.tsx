'use client';

import { useControllableState } from '@jbpark/use-hooks';

import { type ComponentSize, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import { switchComponent } from '../../core';

const { Switch: Core } = switchComponent;

// Keyed by the shared `ComponentSize` vocabulary (#350). The `calc` offset on
// each `handleChecked` is `handle width + 2px` (the `left-0.5` inset), so the
// handle lands flush at both ends — it must be recomputed per row, not copied.
const sizeConfig = {
  small: {
    core: 'sm' as const,
    track: 'h-6! w-10!',
    handle: 'size-5!',
    handleChecked:
      'data-[state=unchecked]:left-0.5 data-[state=checked]:left-[calc(100%-22px)]',
    fontSize: 'text-[10px]',
    marginChecked: 'mr-6 ml-1.5',
    marginUnchecked: 'mr-1.5 ml-6',
  },
  middle: {
    core: 'default' as const,
    track: 'h-8! w-12!',
    handle: 'size-6!',
    handleChecked:
      'data-[state=unchecked]:left-0.5 data-[state=checked]:left-[calc(100%-26px)]',
    fontSize: 'text-xs',
    marginChecked: 'mr-7 ml-2',
    marginUnchecked: 'mr-2 ml-7',
  },
  large: {
    core: 'default' as const,
    track: 'h-10! w-16!',
    handle: 'size-8!',
    handleChecked:
      'data-[state=unchecked]:left-0.5 data-[state=checked]:left-[calc(100%-34px)]',
    fontSize: 'text-sm',
    marginChecked: 'mr-9 ml-2.5',
    marginUnchecked: 'mr-2.5 ml-9',
  },
} satisfies Record<ComponentSize, unknown>;

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onChange'
> {
  classNames?: {
    track?: string;
    handle?: string;
  };
  /**
   * Density on the shared `ComponentSize` scale (`small` | `middle` | `large`),
   * falling back to the nearest `Config`'s `componentSize`, then `middle`.
   *
   * `medium` is accepted as a deprecated alias of `middle` — kept so existing
   * `size="medium"` calls keep working; removed in the next major.
   */
  size?: ComponentSize | 'medium';
  defaultChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
}

const Switch = ({
  className,
  classNames,
  size,
  defaultChecked,
  checked: _checked,
  onChange: _onChange = () => {},
  checkedChildren,
  unCheckedChildren,
  ...props
}: Props) => {
  const [checked, onChange] = useControllableState<boolean>({
    value: _checked,
    defaultValue: defaultChecked ?? false,
    onChange: _onChange,
  });

  const { componentSize } = useConfig();
  // `medium` is the deprecated spelling of `middle`; an explicit `size` wins,
  // then the Config default, then `middle`.
  const resolvedSize =
    (size === 'medium' ? 'middle' : size) ?? componentSize ?? 'middle';

  const hasChildren = !!(checkedChildren || unCheckedChildren);
  const config = sizeConfig[resolvedSize];

  return (
    <Core
      checked={checked}
      size={config.core}
      className={cn(
        'relative',
        config.track,
        hasChildren && 'w-auto! overflow-hidden',
        className,
        classNames?.track,
        //
      )}
      handleClassName={cn(
        config.handle,
        '!absolute top-1/2 !-translate-y-1/2 !translate-x-0',
        'transition-[left] duration-200 will-change-[left]',
        config.handleChecked,
        classNames?.handle,
        //
      )}
      onCheckedChange={checked => {
        onChange(checked);
      }}
      {...props}
    >
      {hasChildren && (
        <span
          className={cn(
            `grid leading-none transition-[margin] duration-200
            will-change-[margin]`,
            config.fontSize,
            checked
              ? [config.marginChecked, 'text-primary-foreground']
              : [config.marginUnchecked, 'text-foreground'],
            //
          )}
        >
          <span
            className={cn(
              'col-start-1 row-start-1 transition-opacity duration-200',
              checked ? 'opacity-100' : 'opacity-0',
            )}
          >
            {checkedChildren}
          </span>
          <span
            className={cn(
              'col-start-1 row-start-1 transition-opacity duration-200',
              checked ? 'opacity-0' : 'opacity-100',
            )}
          >
            {unCheckedChildren}
          </span>
        </span>
      )}
    </Core>
  );
};

export default Switch;
