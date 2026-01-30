import { useState } from 'react';

import { cn } from '@repo/ui/utils';

import Checkbox, { type OptionValue } from '..';

type Option = {
  label: string;
  value: OptionValue;
};

type Options = string[] | number[] | boolean[] | Option[];

export interface Props extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'onChange' | 'defaultValue' | 'value'
> {
  options?: Options;
  direction?: 'vertical' | 'horizontal';
  placement?: 'left' | 'right';
  classNames?: Record<string, string>;
  defaultValue?: OptionValue[];
  value?: OptionValue[];
  onChange?: (values: OptionValue[]) => void;
}

const Group = ({
  direction = 'vertical',
  placement = 'left',
  className,
  classNames = {},
  options: _options = [],
  defaultValue,
  value: _value,
  onChange: _onChange = () => {},
}: Props) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<OptionValue[]>(
    defaultValue || [],
  );

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
    const nextValue = checked
      ? [...value, optionValue]
      : value.filter(v => v !== optionValue);

    if (!controlled) {
      setUncontrolledValue(nextValue);
    }
    _onChange(nextValue);
  };

  return (
    <ul
      className={cn(
        direction === 'vertical' ? 'space-y-2' : 'flex gap-2',
        className,
      )}
    >
      {options.map((item: Option, i: number) => {
        const checked = value.includes(item.value);

        return (
          <li key={i} className={cn('flex', classNames?.wrapper)}>
            <Checkbox
              placement={placement}
              className={cn(classNames?.item)}
              value={item.value}
              checked={checked}
              onChange={checked => onChange(checked, item.value)}
            >
              {item.label}
            </Checkbox>
          </li>
        );
      })}
    </ul>
  );
};

export default Group;
