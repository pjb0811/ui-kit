'use client';

import { useEffect, useState } from 'react';

import { Square, SquareCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { cn } from '@repo/ui/utils';

import Group from './Group';

export type OptionValue = string | number | boolean;

export interface Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  placement?: string;
  checked?: boolean;
  value?: OptionValue;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({
  placement = 'left',
  value = '',
  children,
  className,
  checked: _checked,
  onChange: _onChange = () => {},
  ...props
}: Props) => {
  const [checked, setChecked] = useState(false);

  const id = typeof value === 'boolean' ? uuidv4() : value;

  const icon = (
    <span
      onClick={() => {
        _onChange(!checked);
        setChecked(!checked);
      }}
    >
      {checked ? <SquareCheck /> : <Square />}
    </span>
  );

  const label = (
    <label
      className="w-full cursor-pointer"
      {...(id && {
        htmlFor: `${id}`,
      })}
    >
      {children}
    </label>
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _onChange(e.target.checked);
    setChecked(e.target.checked);
  };

  useEffect(() => {
    setChecked(!!_checked);
  }, [_checked]);

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center gap-x-2',
        className,
        //
      )}
      {...props}
    >
      <input
        id={`${id}`}
        hidden
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      {placement === 'left' ? (
        <>
          {icon}
          {label}
        </>
      ) : (
        <>
          {label}
          {icon}
        </>
      )}
    </div>
  );
};

Checkbox.Group = Group;

export default Checkbox;
