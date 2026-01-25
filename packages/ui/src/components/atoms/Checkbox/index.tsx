'use client';

import { useEffect, useId, useState } from 'react';

import { Square, SquareCheck } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import { Checkbox as CoreCheckbox } from '../../../core/checkbox';
import { Label as CoreLabel } from '../../../core/label';
import Group from './Group';

export type OptionValue = string | number | boolean;

export interface Props extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  placement?: string;
  checked?: boolean;
  value?: OptionValue;
  icons?: { checked: React.ReactNode; unchecked: React.ReactNode };
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({
  placement = 'left',
  value = '',
  children,
  className,
  icons,
  checked: _checked,
  onChange: _onChange = () => {},
  ...props
}: Props) => {
  const [checked, setChecked] = useState(false);

  const reactId = useId();

  const id = typeof value === 'boolean' || !value ? reactId : String(value);

  const onChange = (next: boolean) => {
    setChecked(next);
    _onChange(next);
  };

  const renderContent = icons ? (
    <>
      <input
        id={id}
        hidden
        type="checkbox"
        checked={checked}
        onChange={e => {
          onChange(e.target.checked);
        }}
      />
      <span
        className="cursor-pointer"
        onClick={() => {
          document.getElementById(id)?.click();
        }}
      >
        {checked
          ? (icons.checked ?? <SquareCheck />)
          : (icons.unchecked ?? <Square />)}
      </span>
      {children && (
        <label className="cursor-pointer" htmlFor={id}>
          {children}
        </label>
      )}
    </>
  ) : (
    <>
      <CoreCheckbox
        id={id}
        checked={checked}
        className="cursor-pointer"
        onCheckedChange={onChange}
      />
      {children && (
        <CoreLabel htmlFor={id} className="cursor-pointer text-left">
          {children}
        </CoreLabel>
      )}
    </>
  );

  useEffect(() => {
    setChecked(!!_checked);
  }, [_checked]);

  return (
    <div
      className={cn(
        'flex items-center gap-x-2',
        placement === 'right' && 'flex-row-reverse',
        className,
        //
      )}
      {...props}
    >
      {renderContent}
    </div>
  );
};

Checkbox.Group = Group;

export default Checkbox;
