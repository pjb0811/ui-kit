'use client';

import { useId, useRef } from 'react';

import { useControllableState, useKeyPress } from '@jbpark/use-hooks';
import { Square, SquareCheck, SquareMinus } from 'lucide-react';

import { cn } from '@repo/ui/utils';

import { checkbox, label } from '../../../core';
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
  indeterminate?: boolean;
  value?: OptionValue;
  /** Native form field name — participates in `FormData` when set. */
  name?: string;
  disabled?: boolean;
  icons?: Partial<{
    checked: React.ReactNode;
    unchecked: React.ReactNode;
    indeterminate: React.ReactNode;
  }>;
  children?: React.ReactNode;
  /**
   * Id of the checkbox input, so an external `<label htmlFor>` names the
   * control. `id` and `aria-*` go to the control, not the wrapper. With
   * `icons`, a `<label htmlFor>` doesn't name the focusable icon; use
   * `aria-labelledby` instead.
   */
  id?: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox = ({
  placement = 'left',
  value: _value = '',
  children,
  className,
  icons,
  disabled,
  indeterminate = false,
  defaultChecked,
  checked: _checked,
  name,
  onChange: _onChange = () => {},
  id: idProp,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: Props) => {
  const [checked, setChecked] = useControllableState<boolean>({
    value: _checked,
    defaultValue: defaultChecked ?? false,
    onChange: _onChange,
  });

  const generatedId = useId();
  const id = idProp || generatedId;
  const labelId = `${id}-label`;
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
        ref={element => {
          if (element) element.indeterminate = indeterminate;
        }}
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
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={
          ariaLabelledBy ?? (children && !ariaLabel ? labelId : undefined)
        }
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        tabIndex={disabled ? -1 : 0}
        className={cn(cursorClassName, disabled && 'opacity-50')}
        onClick={() => {
          onChange(!checked);
        }}
      >
        {indeterminate
          ? (icons.indeterminate ?? <SquareMinus />)
          : checked
            ? (icons.checked ?? <SquareCheck />)
            : (icons.unchecked ?? <Square />)}
      </span>
      {children && (
        <label
          id={labelId}
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
        indeterminate={indeterminate}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        // Keep the atom's established 4px radius after the Base UI migration;
        // tailwind-merge lets this override the core primitive's radius (#361).
        className={cn('rounded-sm', cursorClassName)}
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
      data-slot="checkbox-field"
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
