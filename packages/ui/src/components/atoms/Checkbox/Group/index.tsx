import { useEffect, useState } from 'react';

import { cn } from '@repo/ui/utils';

import Checkbox, { type OptionValue } from '..';

type Option = {
  label: string;
  value: OptionValue;
  checked?: boolean;
};

type Options = string[] | number[] | boolean[] | Option[];

export interface Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options?: Options;
  direction?: string;
  placement?: string;
  classNames?: Record<string, string>;
  onChange?: (values: OptionValue[]) => void;
}

const Group = ({
  direction = 'vertical',
  placement = 'left',
  className,
  classNames = {},
  options: _options,
  onChange = () => {},
}: Props) => {
  const [options, setOptions] = useState<Option[]>([]);

  const updateOptions = (checked: boolean, value: OptionValue) => {
    const nextOptions = options.map(item => ({
      ...item,
      checked: item.value === value ? checked : item.checked,
    }));
    setOptions(nextOptions);
    onChange(nextOptions.filter(item => item.checked).map(item => item.value));
  };

  useEffect(() => {
    setOptions(
      _options?.map(item =>
        typeof item === 'object'
          ? item
          : {
              label: `${item}`,
              value: item,
              checked: false,
            },
      ) || [],
    );
  }, [_options]);

  return (
    <ul
      className={cn(
        direction === 'vertical' ? 'space-y-2' : 'flex gap-2',
        className,
      )}
    >
      {options.map((item: Option, i: number) => (
        <li key={i} className={cn('flex', classNames?.wrapper)}>
          <Checkbox
            placement={placement}
            className={cn(classNames?.item)}
            value={item.value}
            onChange={checked => updateOptions(checked, item.value)}
          >
            {item.label}
          </Checkbox>
        </li>
      ))}
    </ul>
  );
};

export default Group;
