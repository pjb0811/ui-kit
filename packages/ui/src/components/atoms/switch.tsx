'use client';

import { useState } from 'react';

import { switchComponent } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { Switch: Core } = switchComponent;

const sizeConfig = {
  medium: {
    core: 'default' as const,
    track: 'h-8! w-12!',
    handle: 'size-6!',
    handleChecked:
      'data-[state=unchecked]:left-0.5 data-[state=checked]:left-[calc(100%-26px)]',
    fontSize: 'text-xs',
    marginChecked: 'mr-7 ml-2',
    marginUnchecked: 'mr-2 ml-7',
  },
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
};

interface Props extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onChange'
> {
  classNames?: {
    track?: string;
    handle?: string;
  };
  size?: 'small' | 'medium';
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
  size = 'medium',
  defaultChecked,
  checked: _checked,
  onChange: _onChange = () => {},
  checkedChildren,
  unCheckedChildren,
  ...props
}: Props) => {
  const [uncontrolledChecked, setUncontrolledChecked] = useState<boolean>(
    defaultChecked || false,
  );

  const controlled = _checked !== undefined;
  const checked = controlled ? _checked : uncontrolledChecked;

  const onChange = (next: boolean) => {
    if (!controlled) {
      setUncontrolledChecked(next);
    }
    _onChange(next);
  };

  const hasChildren = !!(checkedChildren || unCheckedChildren);
  const config = sizeConfig[size];

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
            `grid leading-none text-white transition-[margin] duration-200
            will-change-[margin]`,
            config.fontSize,
            checked ? config.marginChecked : config.marginUnchecked,
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
