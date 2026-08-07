'use client';

import { useContext, useId } from 'react';

import { useControllableState } from '@jbpark/use-hooks';
import { Circle, CircleCheck } from 'lucide-react';

import { field, radio } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

import { RadioGroupContext } from './context';
import { type OptionValue } from './group';

const { RadioGroup: Core, RadioGroupItem: Item } = radio;
const { Field, FieldLabel } = field;

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<typeof Core>,
  'onChange' | 'value'
> {
  placement?: 'left' | 'right';
  defaultChecked?: boolean;
  checked?: boolean;
  value?: OptionValue;
  /** Native form field name — participates in `FormData` when set. */
  name?: string;
  disabled?: boolean;
  /**
   * Id shared by the underlying control and its label. Generated internally
   * when omitted. `RadioGroup` passes a deterministic id so that the group's
   * single Radix root can address each option.
   */
  id?: string;
  icons?: Partial<{ checked: React.ReactNode; unchecked: React.ReactNode }>;
  onChange?: (checked: boolean) => void;
}

const Radio = ({
  placement = 'left',
  value: _value = '',
  children,
  className,
  icons,
  disabled,
  defaultChecked,
  checked: _checked,
  id: _id,
  name,
  onChange: _onChange = () => {},
  ...props
}: Props) => {
  const [checked, setChecked] = useControllableState<boolean>({
    value: _checked,
    defaultValue: defaultChecked ?? false,
    onChange: _onChange,
  });

  const generatedId = useId();
  const id = _id ?? generatedId;
  // Radix identifies/submits an item by its `value`, which is separate from
  // `id` (used only for the DOM id/label pairing) — stringified since Radix
  // requires a string, while `OptionValue` also allows number/boolean.
  const itemValue = String(_value);
  const grouped = useContext(RadioGroupContext);

  const cursorClassName = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  const onChange = (next: boolean) => {
    if (disabled) {
      return;
    }

    setChecked(next);
  };

  // When rendered inside a `RadioGroup`, the group owns the single shared
  // `Core` (Radix radiogroup root) so that arrow keys move focus across every
  // option. A standalone `Radio` still has to provide its own root.
  const renderField = (
    <Field
      orientation="horizontal"
      className={cn('flex gap-2', placement === 'right' && 'flex-row-reverse')}
      data-disabled={disabled}
    >
      <Item value={itemValue} id={id} checked={checked} disabled={disabled} />
      <FieldLabel htmlFor={id} className={cursorClassName}>
        {children}
      </FieldLabel>
    </Field>
  );

  const renderContent = icons ? (
    <>
      <input
        id={id}
        hidden
        type="radio"
        name={name}
        value={itemValue}
        checked={checked}
        disabled={disabled}
        onChange={e => {
          onChange(e.target.checked);
        }}
      />
      <span
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={cn(cursorClassName, disabled && 'opacity-50')}
        onClick={() => {
          onChange(true);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(true);
          }
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
  ) : grouped ? (
    renderField
  ) : (
    <Core
      name={name}
      value={checked ? itemValue : ''}
      onValueChange={() => onChange(true)}
    >
      {renderField}
    </Core>
  );

  return (
    <div
      className={cn(
        'flex items-center',
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

export default Radio;
