import { useState } from 'react';

import { Button } from '@repo/ui';
import { cn } from '@repo/ui/utils';

import Radio from '..';

export type OptionValue = string | number | boolean;

type Option = {
  label: string;
  value: OptionValue;
  disabled?: boolean;
};

type Options = string[] | number[] | boolean[] | Option[];

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
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
}: Props) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<
    OptionValue | undefined
  >(defaultValue);

  const controlled = _value !== undefined;
  const value = controlled ? _value : uncontrolledValue;

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
    if (!controlled) {
      setUncontrolledValue(optionValue);
    }
    _onChange(optionValue);
  };

  return (
    <ul
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
                placement={placement}
                className={cn(classNames?.item)}
                value={item.value}
                checked={checked}
                disabled={item.disabled}
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
};

export default RadioGroup;
