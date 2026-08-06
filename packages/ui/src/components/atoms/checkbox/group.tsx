'use client';

import { useControllableState } from '@jbpark/use-hooks';

import { cn } from '@repo/ui/utils';

import Checkbox from './checkbox';

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
  defaultValue?: OptionValue[];
  value?: OptionValue[];
  onChange?: (values: OptionValue[]) => void;
}

const Group = ({
  orientation = 'vertical',
  placement = 'left',
  className,
  classNames = {},
  options: _options = [],
  defaultValue,
  value: _value,
  onChange: _onChange = () => {},
  ...props
}: Props) => {
  const [value, setValue] = useControllableState<OptionValue[]>({
    value: _value,
    defaultValue: defaultValue ?? [],
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

  const onChange = (checked: boolean, optionValue: OptionValue) => {
    const nextValue = checked
      ? [...value, optionValue]
      : value.filter(v => v !== optionValue);

    setValue(nextValue);
  };

  return (
    <ul
      {...props}
      className={cn(
        orientation === 'vertical' ? 'space-y-2' : 'flex gap-2',
        className,
      )}
    >
      {options.map((item: Option) => {
        const checked = value.includes(item.value);

        return (
          <li
            key={String(item.value)}
            className={cn('flex', classNames?.wrapper)}
          >
            <Checkbox
              placement={placement}
              className={cn(classNames?.item)}
              value={item.value}
              checked={checked}
              disabled={item.disabled}
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
