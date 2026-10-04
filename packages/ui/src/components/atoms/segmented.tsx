'use client';

import * as React from 'react';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';

import { type ComponentSize, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

export interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const sizeClasses: Record<ComponentSize, string> = {
  small: 'min-h-7 px-2 text-xs',
  middle: 'min-h-8 px-3 text-sm',
  large: 'min-h-10 px-4 text-base',
};

export interface Props extends Omit<
  ToggleGroup.Props,
  'children' | 'value' | 'defaultValue' | 'onValueChange' | 'onChange' | 'multiple'
> {
  options: readonly (string | Option)[];
  value?: string;
  defaultValue?: string;
  /** Clicking the selected item keeps it selected. */
  onChange?: (value: string) => void;
  size?: ComponentSize;
  classNames?: {
    item?: string;
    activeItem?: string;
  };
}

const Segmented = ({
  options,
  value,
  defaultValue,
  onChange,
  size,
  className,
  classNames,
  disabled,
  orientation = 'horizontal',
  ...props
}: Props) => {
  const normalizedOptions = options.map(option =>
    typeof option === 'string'
      ? { label: option, value: option, disabled: false, icon: null }
      : option,
  );
  const firstEnabled = normalizedOptions.find(
    option => !option.disabled,
  )?.value;
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? firstEnabled,
  );
  const selectedValue = value !== undefined ? value : internalValue;
  const { componentSize } = useConfig();
  const resolvedSize = size ?? componentSize ?? 'middle';

  const handleValueChange = (values: string[]) => {
    const nextValue = values[0];

    if (nextValue === undefined || nextValue === selectedValue) {
      return;
    }

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  return (
    <ToggleGroup
      {...props}
      data-slot="segmented"
      disabled={disabled}
      orientation={orientation}
      value={selectedValue === undefined ? [] : [selectedValue]}
      onValueChange={handleValueChange}
      className={cn(
        `bg-muted inline-flex w-fit gap-0.5 rounded-lg p-1
        data-[orientation=vertical]:flex-col`,
        className,
        //
      )}
    >
      {normalizedOptions.map(option => (
        <Toggle
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={cn(
            `text-muted-foreground hover:text-foreground
            focus-visible:ring-ring/50 data-pressed:bg-background
            data-pressed:text-foreground inline-flex items-center justify-center
            gap-1.5 rounded-md font-medium whitespace-nowrap outline-none
            focus-visible:ring-[3px] disabled:cursor-not-allowed
            disabled:opacity-50 data-pressed:shadow-xs`,
            sizeClasses[resolvedSize],
            classNames?.item,
            selectedValue === option.value && classNames?.activeItem,
            //
          )}
        >
          {option.icon}
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
};

export default Segmented;
