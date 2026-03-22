'use client';

import { useState } from 'react';

import { switchComponent } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { Switch: Core } = switchComponent;

const sizeConfig = {
  medium: {
    core: 'default' as const,
    handleChecked:
      'data-[state=unchecked]:left-0 data-[state=checked]:left-[calc(100%-16px)]',
    fontSize: 'text-[9px]',
    marginChecked: 'mr-4.5 ml-1',
    marginUnchecked: 'mr-1 ml-4.5',
  },
  small: {
    core: 'sm' as const,
    handleChecked:
      'data-[state=unchecked]:left-0 data-[state=checked]:left-[calc(100%-12px)]',
    fontSize: 'text-[7px]',
    marginChecked: 'mr-3.5 ml-0.5',
    marginUnchecked: 'mr-0.5 ml-3.5',
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
        hasChildren && 'w-auto! overflow-hidden',
        className,
        classNames?.track,
        //
      )}
      handleClassName={cn(
        hasChildren && [
          '!absolute top-1/2 !-translate-y-1/2 !translate-x-0',
          'transition-[left] duration-200',
          config.handleChecked,
        ],
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
            'grid leading-none text-white transition-[margin] duration-200',
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
