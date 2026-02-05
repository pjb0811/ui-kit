'use client';

import { useId, useState } from 'react';

import { Square, SquareCheck } from 'lucide-react';

import { checkbox, label } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

import Group from './Group';

const { Checkbox: CoreCheckbox } = checkbox;
const { Label: CoreLabel } = label;

export type OptionValue = string | number | boolean;

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  placement?: 'left' | 'right';
  defaultChecked?: boolean;
  checked?: boolean;
  value?: OptionValue;
  disabled?: boolean;
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
  disabled,
  defaultChecked,
  checked: _checked,
  onChange: _onChange = () => {},
  ...props
}: Props) => {
  const [uncontrolledChecked, setUncontrolledChecked] = useState<boolean>(
    defaultChecked || false,
  );

  const reactId = useId();

  const id = typeof value === 'boolean' || !value ? reactId : String(value);
  const controlled = _checked !== undefined;
  const checked = controlled ? _checked : uncontrolledChecked;

  const cursorClassName = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  const onChange = (next: boolean) => {
    if (disabled) {
      return;
    }

    if (!controlled) {
      setUncontrolledChecked(next);
    }
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
        className={cn(cursorClassName, disabled && 'opacity-50')}
        onClick={() => {
          document.getElementById(id)?.click();
        }}
      >
        {checked
          ? (icons.checked ?? <SquareCheck />)
          : (icons.unchecked ?? <Square />)}
      </span>
      {children && (
        <label
          className={cn(cursorClassName, disabled && 'opacity-50')}
          htmlFor={id}
        >
          {children}
        </label>
      )}
    </>
  ) : (
    <>
      <CoreCheckbox
        id={id}
        checked={checked}
        disabled={disabled}
        className={cn(cursorClassName)}
        onCheckedChange={onChange}
      />
      {children && (
        <CoreLabel htmlFor={id} className={cn(cursorClassName, 'text-left')}>
          {children}
        </CoreLabel>
      )}
    </>
  );

  return (
    <div
      className={cn(
        'flex items-center gap-x-2',
        placement === 'right' && 'flex-row-reverse',
        cursorClassName,
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
