'use client';

import { useId } from 'react';

import { useControllableState } from '@jbpark/use-hooks';

import { radio } from '@repo/ui/core';
import { cn } from '@repo/ui/utils';

import Button from '../button';
import { RadioGroupContext } from './context';
import Radio from './radio';

const { RadioGroup: Core } = radio;

export type OptionValue = string | number | boolean;

type Option = {
  label: string;
  value: OptionValue;
  disabled?: boolean;
};

type Options = string[] | number[] | boolean[] | Option[];

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'ul'>,
  'onChange' | 'defaultValue' | 'value'
> {
  options?: Options;
  orientation?: 'vertical' | 'horizontal';
  placement?: 'left' | 'right';
  classNames?: Record<string, string>;
  defaultValue?: OptionValue;
  value?: OptionValue;
  optionType?: 'default' | 'button';
  buttonStyle?: 'solid' | 'outlined';
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
  onChange?: (value: OptionValue) => void;
}

const RadioGroup = ({
  orientation = 'horizontal',
  placement = 'left',
  className,
  classNames = {},
  options: _options = [],
  optionType = 'default',
  buttonStyle = 'solid',
  size,
  disabled,
  defaultValue,
  value: _value,
  onChange: _onChange = () => {},
  ...props
}: Props) => {
  const [value, setValue] = useControllableState<OptionValue>({
    value: _value,
    defaultValue,
    onChange: _onChange,
  });

  const options: Option[] = _options.map(item =>
    typeof item === 'object'
      ? item
      : {
          label: `${item}`,
          value: item,
        },
  );

  const isButton = optionType === 'button';

  const onChange = (checked: boolean, optionValue: OptionValue) => {
    if (!checked) {
      return;
    }
    setValue(optionValue);
  };

  // A single Radix radiogroup root owns every option so that arrow keys move
  // focus across the whole group. Radix addresses items by string value, so
  // each option gets a deterministic id derived from a stable base id.
  const baseId = useId();
  const getOptionId = (index: number) => `${baseId}-${index}`;
  const checkedIndex = options.findIndex(item => item.value === value);
  const checkedId = checkedIndex === -1 ? '' : getOptionId(checkedIndex);

  const onValueChange = (optionId: string) => {
    const item = options.find((_, index) => getOptionId(index) === optionId);

    if (!item) {
      return;
    }

    onChange(true, item.value);
  };

  const list = (
    <ul
      {...props}
      className={cn(
        'flex gap-4',
        className,
        orientation === 'vertical' && 'flex-col',
        isButton && 'gap-0',
      )}
    >
      {options.map((item: Option, index) => {
        const checked = value === item.value;

        return (
          <li
            key={String(item.value)}
            className={cn('flex', classNames?.wrapper)}
          >
            {isButton ? (
              <Button
                variant={checked ? buttonStyle : 'outlined'}
                size={size}
                className={cn(
                  'rounded-none',
                  index === 0 && 'rounded-l-lg',
                  index === options.length - 1 && 'rounded-r-lg',
                  checked && buttonStyle === 'outlined' && 'border-primary',
                )}
                disabled={disabled || item.disabled}
                onClick={() => onChange(true, item.value)}
              >
                {item.label}
              </Button>
            ) : (
              <Radio
                id={getOptionId(index)}
                placement={placement}
                className={cn(classNames?.item)}
                value={item.value}
                checked={checked}
                disabled={disabled || item.disabled}
                onChange={checked => onChange(checked, item.value)}
              >
                {item.label}
              </Radio>
            )}
          </li>
        );
      })}
    </ul>
  );

  // `optionType='button'` renders `Button`s instead of radios, so it keeps the
  // plain list and stays out of the Radix radiogroup entirely.
  if (isButton) {
    return list;
  }

  return (
    <RadioGroupContext.Provider value={true}>
      <Core className="block" value={checkedId} onValueChange={onValueChange}>
        {list}
      </Core>
    </RadioGroupContext.Provider>
  );
};

export default RadioGroup;
