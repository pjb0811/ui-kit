'use client';

import * as React from 'react';

import { OTPField, type OTPFieldRoot } from '@base-ui/react/otp-field';

import { type ComponentSize, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Input from './input';

declare const process: { env: { NODE_ENV?: string } };

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
  | 'length'
> {
  /** Positive safe integer slot count. Invalid or omitted values use six. */
  length?: number;
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
  length = 6,
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
  const isValidLength = Number.isSafeInteger(length) && length > 0;
  const count = isValidLength ? length : 6;

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && !isValidLength) {
      console.warn(
        'Input.OTP length must be a positive safe integer; using six.',
      );
    }
  }, [isValidLength, length]);

  return (
    <div data-slot="input-otp">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'mb-1.5 block text-sm font-medium',
            classNames?.label,
            //
          )}
        >
          {label}
        </label>
      )}
      <OTPField.Root
        {...props}
        id={inputId}
        length={count}
        autoSubmit={false}
        onValueChange={onChange}
        onValueComplete={onComplete}
        aria-describedby={describedBy}
        className={cn(
          'flex flex-wrap gap-2',
          classNames?.group,
          className,
          //
        )}
      >
        {Array.from({ length: count }, (_, index) => (
          <OTPField.Input
            key={index}
            ref={index === 0 ? inputRef : undefined}
            render={<Input />}
            placeholder={placeholder}
            aria-label={index === 0 ? ariaLabel : getSlotLabel(index, count)}
            aria-labelledby={index === 0 ? labelledBy : undefined}
            className={cn(
              'shrink-0 px-0 text-center tabular-nums',
              sizes[size ?? componentSize ?? 'middle'],
              classNames?.input,
              //
            )}
          />
        ))}
      </OTPField.Root>
    </div>
  );
};
export default OTP;
