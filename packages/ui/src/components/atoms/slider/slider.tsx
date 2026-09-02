'use client';

import { useControllableState } from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import { slider } from '../../../core';

const { Slider: Core } = slider;

/** A single thumb (`number`) or a two-thumb range (`[min, max]`). */
export type SliderValue = number | number[];

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'onChange' | 'defaultValue' | 'dir'
> {
  value?: SliderValue;
  defaultValue?: SliderValue;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: SliderValue) => void;
}

const toArray = (value: SliderValue | undefined): number[] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
};

const Slider = ({
  value: _value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  orientation = 'horizontal',
  onChange: _onChange = () => {},
  className,
  ...props
}: Props) => {
  // A `number[]` value/defaultValue means the consumer wants a range; a bare
  // `number` means a single thumb. Radix works in `number[]` throughout, so we
  // normalise on the way in and hand the original shape back through `onChange`.
  const isRange = Array.isArray(_value ?? defaultValue);

  const [value, onChange] = useControllableState<number[]>({
    value: toArray(_value),
    defaultValue: toArray(defaultValue) ?? [min],
    onChange: next => {
      _onChange(isRange ? next : (next[0] ?? min));
    },
  });

  return (
    <Core
      value={value}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      orientation={orientation}
      className={cn(className)}
      onValueChange={onChange}
      {...props}
    />
  );
};

export default Slider;
