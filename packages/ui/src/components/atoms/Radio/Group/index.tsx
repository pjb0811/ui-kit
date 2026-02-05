import { useState } from 'react';

import { cn } from '@repo/ui/utils';

import Radio, { OptionValue } from '..';

type Option = {
  label: string;
  value: OptionValue;
};

type Options = string[] | number[] | boolean[] | Option[];

interface Props extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue' | 'value'
> {
  options?: Options;
  orientation?: 'vertical' | 'horizontal';
  placement?: 'left' | 'right';
  classNames?: Record<string, string>;
  defaultValue?: OptionValue;
  value?: OptionValue;
  onChange?: (value: OptionValue) => void;
}

const RadioGroup = ({
  orientation = 'vertical',
  placement = 'left',
  className,
  classNames = {},
  options: _options = [],
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
        orientation === 'vertical' ? 'space-y-2' : 'flex gap-2',
        className,
      )}
    >
      {options.map((item: Option) => {
        const checked = value === item.value;

        return (
          <li
            key={String(item.value)}
            className={cn('flex', classNames?.wrapper)}
          >
            <Radio
              placement={placement}
              className={cn(classNames?.item)}
              value={item.value}
              checked={checked}
              onChange={checked => onChange(checked, item.value)}
            >
              {item.label}
            </Radio>
          </li>
        );
      })}
    </ul>
  );
};

export default RadioGroup;
