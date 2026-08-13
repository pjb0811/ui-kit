'use client';

import { useId, useRef } from 'react';

import { useControllableState, useKeyPress } from '@jbpark/use-hooks';
import { Square, SquareCheck } from 'lucide-react';

import { checkbox, label } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

import { type OptionValue } from './group';

const { Checkbox: CoreCheckbox } = checkbox;
const { Label: CoreLabel } = label;

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onChange'
> {
  placement?: 'left' | 'right';
  defaultChecked?: boolean;
  checked?: boolean;
  value?: OptionValue;
  /** Native form field name — participates in `FormData` when set. */
  name?: string;
  disabled?: boolean;
  icons?: Partial<{ checked: React.ReactNode; unchecked: React.ReactNode }>;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({
  placement = 'left',
  value: _value = '',
  children,
  className,
  icons,
  disabled,
  defaultChecked,
  checked: _checked,
  name,
  onChange: _onChange = () => {},
  ...props
}: Props) => {
  const [checked, setChecked] = useControllableState<boolean>({
    value: _checked,
    defaultValue: defaultChecked ?? false,
    onChange: _onChange,
  });

  const id = useId();
  const itemValue = String(_value);

  const cursorClassName = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  const onChange = (next: boolean) => {
    if (disabled) {
      return;
    }

    setChecked(next);
  };

  const iconTriggerRef = useRef<HTMLSpanElement>(null);

  useKeyPress(
    ['Enter', 'space'],
    event => {
      event.preventDefault();
      onChange(!checked);
    },
    { target: iconTriggerRef, enabled: !!icons && !disabled },
  );

  const renderContent = icons ? (
    <>
      <input
        id={id}
        hidden
        type="checkbox"
        name={name}
        value={itemValue}
        checked={checked}
        disabled={disabled}
        onChange={e => {
          onChange(e.target.checked);
        }}
      />
      <span
        ref={iconTriggerRef}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={cn(cursorClassName, disabled && 'opacity-50')}
        onClick={() => {
          onChange(!checked);
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
        name={name}
        value={itemValue}
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

export default Checkbox;
