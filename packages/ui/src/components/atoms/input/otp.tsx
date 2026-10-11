'use client';

import * as React from 'react';

import { OTPField, type OTPFieldRoot } from '@base-ui/react/otp-field';

import { type ComponentSize, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Input from './input';

const sizes: Record<ComponentSize, string> = {
  small: 'h-8 w-8',
  middle: 'h-9 w-9',
  large: 'h-10 w-10',
};

export interface Props extends Omit<
  React.ComponentProps<typeof OTPField.Root>,
  | 'children'
  | 'onValueChange'
  | 'onValueComplete'
  | 'autoSubmit'
  | 'render'
  | 'className'
> {
  className?: string;
  label?: string;
  onChange?: (value: string, details: OTPFieldRoot.ChangeEventDetails) => void;
  onComplete?: (
    value: string,
    details: OTPFieldRoot.CompleteEventDetails,
  ) => void;
  size?: ComponentSize;
  inputRef?: React.Ref<HTMLInputElement>;
  placeholder?: string;
  /** Localize the accessible name of each slot after the first. */
  getSlotLabel?: (index: number, length: number) => string;
  classNames?: { label?: string; group?: string; input?: string };
}

const OTP = ({
  label,
  id,
  length,
  size,
  onChange,
  onComplete,
  inputRef,
  placeholder,
  getSlotLabel = (index, count) => `Character ${index + 1} of ${count}`,
  className,
  classNames,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  ...props
}: Props) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const { componentSize } = useConfig();
  if (!Number.isSafeInteger(length) || length < 1) {
    throw new RangeError('Input.OTP length must be a positive safe integer.');
  }
  return (
    <div data-slot="input-otp" className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn('mb-1.5 block text-sm font-medium', classNames?.label)}
        >
          {label}
        </label>
      )}
      <OTPField.Root
        {...props}
        id={inputId}
        length={length}
        autoSubmit={false}
        onValueChange={onChange}
        onValueComplete={onComplete}
        aria-describedby={describedBy}
        className={cn('flex flex-wrap gap-2', classNames?.group)}
      >
        {Array.from({ length }, (_, index) => (
          <OTPField.Input
            key={index}
            ref={index === 0 ? inputRef : undefined}
            render={<Input />}
            placeholder={placeholder}
            aria-label={index === 0 ? ariaLabel : getSlotLabel(index, length)}
            aria-labelledby={index === 0 ? labelledBy : undefined}
            aria-describedby={describedBy}
            className={cn(
              'shrink-0 px-0 text-center tabular-nums',
              sizes[size ?? componentSize ?? 'middle'],
              classNames?.input,
            )}
          />
        ))}
      </OTPField.Root>
    </div>
  );
};
export default OTP;
