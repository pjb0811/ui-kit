'use client';

import * as React from 'react';

import { useMergedRef } from '@jbpark/use-hooks';
import { CircleX } from 'lucide-react';

import { type ComponentSize, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from './button';
import Input from './input';

const sizes: Record<ComponentSize, string> = {
  small: 'h-8',
  middle: 'h-9',
  large: 'h-10',
};

export interface Props extends Omit<
  React.ComponentPropsWithRef<'input'>,
  'children' | 'defaultValue' | 'onChange' | 'size' | 'step' | 'type' | 'value'
> {
  /** Visible label. An external label or aria-label can be used instead. */
  label?: string;
  /** A local time in 24-hour HH:mm form; null keeps a controlled field empty. */
  value?: string | null;
  defaultValue?: string;
  /** Called with HH:mm, or null when the field is cleared. */
  onChange?: (value: string | null) => void;
  /** Positive whole-minute interval. Native time inputs use seconds for step. */
  minuteStep?: number;
  allowClear?: boolean;
  clearLabel?: string;
  size?: ComponentSize;
  classNames?: {
    label?: string;
    input?: string;
    clear?: string;
  };
}

const TimePicker = ({
  ref,
  id,
  label,
  value,
  defaultValue,
  onChange,
  minuteStep = 1,
  allowClear = true,
  clearLabel = 'Clear time',
  size,
  disabled,
  readOnly,
  className,
  classNames,
  ...props
}: Props) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRef(inputRef, ref);
  const { componentSize } = useConfig();
  const resolvedSize = size ?? componentSize ?? 'middle';
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? '',
  );
  const currentValue = isControlled ? (value ?? '') : uncontrolledValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;

    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onChange?.(nextValue || null);
  };

  const handleClear = () => {
    if (!isControlled && inputRef.current) {
      inputRef.current.value = '';
      setUncontrolledValue('');
    }

    onChange?.(null);
    inputRef.current?.focus();
  };

  return (
    <div data-slot="time-picker" className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn('mb-1.5 block text-sm font-medium', classNames?.label)}
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-1">
        <Input
          {...props}
          ref={mergedRef}
          id={inputId}
          type="time"
          step={minuteStep * 60}
          disabled={disabled}
          readOnly={readOnly}
          value={isControlled ? (value ?? '') : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          className={cn(
            'min-w-0 flex-1',
            sizes[resolvedSize],
            classNames?.input,
            //
          )}
        />
        {allowClear && currentValue && !disabled && !readOnly && (
          <Button
            htmlType="button"
            variant="text"
            shape="circle"
            size={resolvedSize}
            icon={<CircleX />}
            aria-label={clearLabel}
            data-time-picker-clear=""
            className={cn(classNames?.clear)}
            onClick={handleClear}
          />
        )}
      </div>
    </div>
  );
};

export default TimePicker;
