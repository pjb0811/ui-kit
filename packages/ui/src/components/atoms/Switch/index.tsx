'use client';

import { useState } from 'react';

import { switchComponent } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

const { Switch: Core } = switchComponent;

interface Props extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'onChange'
> {
  classNames?: {
    track?: string;
    handle?: string;
  };
  defaultChecked?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const Switch = ({
  className,
  classNames,
  defaultChecked,
  checked: _checked,
  onChange: _onChange = () => {},
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

  return (
    <Core
      checked={checked}
      className={cn(
        'h-8.5 w-13',
        className,
        classNames?.track,
        //
      )}
      handleClassName={cn(
        'h-7 w-7',
        'data-[state=checked]:translate-x-5',
        'data-[state=unchecked]:translate-x-[2px]',
        classNames?.handle,
      )}
      onCheckedChange={checked => {
        onChange(checked);
      }}
      {...props}
    />
  );
};

export default Switch;
