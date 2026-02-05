'use client';

import { useId, useState } from 'react';

import { Circle, CircleCheck } from 'lucide-react';

import { field, radio } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

import Group from './Group';

const { RadioGroup: Core, RadioGroupItem: Item } = radio;
const { Field, FieldLabel } = field;

export type OptionValue = string | number | boolean;

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<typeof Core>,
  'onChange' | 'value'
> {
  placement?: 'left' | 'right';
  defaultChecked?: boolean;
  checked?: boolean;
  value?: OptionValue;
  disabled?: boolean;
  icons?: { checked: React.ReactNode; unchecked: React.ReactNode };
  onChange?: (checked: boolean) => void;
}

const Radio = ({
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
        type="radio"
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
          ? (icons.checked ?? <CircleCheck />)
          : (icons.unchecked ?? <Circle />)}
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
    <Core value={checked ? id : ''} onValueChange={() => onChange(true)}>
      <Field
        orientation="horizontal"
        className={cn('flex', placement === 'right' && 'flex-row-reverse')}
        data-disabled={disabled}
      >
        <Item value={id} id={id} checked={checked} disabled={disabled} />
        <FieldLabel htmlFor={id}>{children}</FieldLabel>
      </Field>
    </Core>
  );

  return (
    <div
      className={cn(
        'flex items-center gap-x-2',
        icons && placement === 'right' && 'flex-row-reverse',
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

Radio.Group = Group;

export default Radio;
