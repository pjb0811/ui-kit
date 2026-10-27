'use client';

import type { ReactNode } from 'react';

import { DirectionProvider } from '@base-ui/react/direction-provider';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { useControllableState } from '@jbpark/use-hooks';

import { type ComponentSize, useConfig } from '@repo/ui/providers';
import { cn } from '@repo/ui/utils';

import Button from './button';

export interface Option {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  // Shows only the icon; the label stays the button's accessible name.
  iconOnly?: boolean;
}

export interface Props extends Omit<
  ToggleGroupPrimitive.Props,
  | 'children'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'multiple'
  | 'className'
  | 'onChange'
  | 'dir'
> {
  options: readonly Option[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  // Receives pressed values in option order, followed by supplied values that
  // match no option.
  onChange?: (values: string[]) => void;
  size?: ComponentSize;
  dir?: 'ltr' | 'rtl';
  className?: string;
  classNames?: {
    item?: string;
    pressedItem?: string;
  };
}

const ToggleGroup = ({
  options,
  value,
  defaultValue = [],
  onChange,
  size,
  disabled,
  orientation = 'horizontal',
  dir,
  className,
  classNames,
  ...props
}: Props) => {
  const { componentSize, direction } = useConfig();
  const [pressed, setPressed] = useControllableState<readonly string[]>({
    value,
    defaultValue,
    onChange: values => onChange?.([...values]),
  });

  const resolvedSize = size ?? componentSize ?? 'middle';
  const resolvedDirection = dir ?? direction;
  const pressedSet = new Set(pressed);
  const optionValues = new Set(options.map(option => option.value));

  const handleValueChange = (values: string[]) => {
    const next = new Set(values);

    setPressed([
      ...options
        .filter(option => next.has(option.value))
        .map(option => option.value),
      ...[...new Set(pressed)].filter(item => !optionValues.has(item)),
    ]);
  };

  return (
    <DirectionProvider direction={resolvedDirection}>
      <ToggleGroupPrimitive
        {...props}
        data-slot="toggle-group"
        dir={resolvedDirection}
        multiple
        disabled={disabled}
        orientation={orientation}
        value={[...pressedSet]}
        onValueChange={handleValueChange}
        className={cn(
          'inline-flex w-fit gap-1 data-[orientation=vertical]:flex-col',
          className, //
        )}
      >
        {options.map(option => (
          <Toggle
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            aria-label={option.iconOnly ? option.label : undefined}
            render={
              <Button
                variant="text"
                size={resolvedSize}
                shape={option.iconOnly ? 'circle' : 'default'}
                icon={option.icon}
              />
            }
            className={cn(
              `aria-disabled:cursor-not-allowed data-pressed:bg-accent
              data-pressed:text-accent-foreground`,
              classNames?.item,
              pressedSet.has(option.value) && classNames?.pressedItem,
              //
            )}
          >
            {option.iconOnly ? null : option.label}
          </Toggle>
        ))}
      </ToggleGroupPrimitive>
    </DirectionProvider>
  );
};

export default ToggleGroup;
