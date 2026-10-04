'use client';

import * as React from 'react';

import { NumberField, type NumberFieldRoot } from '@base-ui/react/number-field';
import { Minus, Plus } from 'lucide-react';

import { type ComponentSize, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from '../button';
import Input from './input';

const sizes: Record<ComponentSize, string> = {
  small: 'h-8',
  middle: 'h-9',
  large: 'h-10',
};

export interface Props extends Omit<
  React.ComponentProps<typeof NumberField.Root>,
  'children' | 'onValueChange'
> {
  /** Visible input label. Alternatively, pair `id` with an external label. */
  label?: string;
  /** Called with the numeric value (or null when cleared). */
  onChange?: (
    value: number | null,
    eventDetails: NumberFieldRoot.ChangeEventDetails,
  ) => void;
  placeholder?: string;
  size?: ComponentSize;
  classNames?: {
    label?: string;
    group?: string;
    input?: string;
    decrement?: string;
    increment?: string;
  };
}

const Number = ({
  ref,
  id,
  label,
  onChange,
  placeholder,
  size,
  className,
  classNames,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: Props) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const { componentSize } = useConfig();
  const resolvedSize = size ?? componentSize ?? 'middle';

  return (
    <NumberField.Root
      {...props}
      ref={ref}
      id={inputId}
      onValueChange={onChange}
      data-slot="input-number"
      className={cn('w-full', className)}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={cn('mb-1.5 block text-sm font-medium', classNames?.label)}
        >
          {label}
        </label>
      )}
      <NumberField.Group
        className={cn(
          `border-input focus-within:border-ring focus-within:ring-ring/50 flex
          w-full items-stretch overflow-hidden rounded-md border shadow-xs
          focus-within:ring-[3px]`,
          sizes[resolvedSize],
          classNames?.group,
          //
        )}
      >
        <NumberField.Decrement
          aria-label="Decrease value"
          render={
            <Button
              variant="text"
              size="small"
              icon={<Minus />}
              className={cn(
                'h-full! rounded-none px-2!',
                classNames?.decrement,
              )}
            />
          }
        />
        <NumberField.Input
          render={<Input />}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          className={cn(
            `h-full min-w-0 flex-1 rounded-none border-0 text-center shadow-none
            focus-visible:ring-0`,
            classNames?.input,
            //
          )}
        />
        <NumberField.Increment
          aria-label="Increase value"
          render={
            <Button
              variant="text"
              size="small"
              icon={<Plus />}
              className={cn(
                'h-full! rounded-none px-2!',
                classNames?.increment,
              )}
            />
          }
        />
      </NumberField.Group>
    </NumberField.Root>
  );
};

export default Number;
